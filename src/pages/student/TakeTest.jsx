import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ArrowLeft, 
  Send, 
  AlertTriangle,
  CheckCircle2,
  Timer
} from 'lucide-react';
import DashboardLayout from '../../components/ui/DashboardLayout';
import { useAuth } from '../../lib/AuthContext';
import { apiClient, API_ENDPOINTS } from '../../lib/api/client';

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  // Timer state (5 minutes = 300 seconds)
  const [timeLeft, setTimeLeft] = useState(300);
  const [timerExpired, setTimerExpired] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  
  // Test answers
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);

  // Load test data
  useEffect(() => {
    if (testId && user?.id) {
      loadTest();
    }
  }, [testId, user]);

  // Timer logic
  useEffect(() => {
    if (!testStarted || timerExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimerExpired(true);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timerExpired]);

  const loadTest = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(API_ENDPOINTS.STUDENT_TEST(user.id, testId));
      
      if (response.success) {
        setTest(response.test);
      } else {
        setError('Failed to load test');
      }
    } catch (error) {
      console.error('Error loading test:', error);
      setError('Failed to load test. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const startTest = () => {
    setTestStarted(true);
    setStartTime(new Date());
  };

  const handleAnswerChange = (questionId, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  };

  const handleAutoSubmit = useCallback(async () => {
    if (!test || !startTime) return;
    
    try {
      setSubmitting(true);
      const timeTaken = Math.floor((new Date() - startTime) / 1000);
      
      // Convert answers to expected format
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));

      const response = await apiClient.post(API_ENDPOINTS.SUBMIT_TEST, {
        testId: test.id,
        studentId: user.id,
        answers: formattedAnswers,
        timeTaken,
        startedAt: startTime.toISOString(),
        completedAt: new Date().toISOString()
      });

      if (response.success) {
        navigate('/student/results', { 
          state: { 
            submissionResult: response.result,
            autoSubmitted: true
          }
        });
      } else {
        setError('Failed to submit test. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      setError('Failed to submit test. Please contact your teacher.');
    } finally {
      setSubmitting(false);
    }
  }, [test, answers, startTime, user, navigate]);

  const handleSubmit = async () => {
    if (!test || !startTime) return;
    
    // Check if all questions are answered
    const unansweredQuestions = test.questions?.filter(q => !answers[q.id]) || [];
    if (unansweredQuestions.length > 0) {
      const confirm = window.confirm(
        `You have ${unansweredQuestions.length} unanswered questions. Are you sure you want to submit?`
      );
      if (!confirm) return;
    }

    await handleAutoSubmit();
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 120) return 'success'; // Green if > 2 minutes
    if (timeLeft > 60) return 'warning';   // Yellow if > 1 minute
    return 'danger';                       // Red if < 1 minute
  };

  if (loading) {
    return (
      <DashboardLayout title="Loading Test">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading test...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Test Error">
        <div className="text-center py-5">
          <AlertTriangle className="text-danger mb-3" size={48} />
          <h4 className="text-danger mb-3">Error Loading Test</h4>
          <p className="text-muted mb-4">{error}</p>
          <button 
            className="btn btn-primary me-3" 
            onClick={() => navigate('/student/dashboard')}
          >
            <ArrowLeft size={16} className="me-2" />
            Back to Dashboard
          </button>
          <button className="btn btn-outline-primary" onClick={loadTest}>
            Try Again
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!test) {
    return (
      <DashboardLayout title="Test Not Found">
        <div className="text-center py-5">
          <AlertTriangle className="text-warning mb-3" size={48} />
          <h4 className="text-warning mb-3">Test Not Found</h4>
          <p className="text-muted mb-4">The requested test could not be found.</p>
          <button 
            className="btn btn-primary" 
            onClick={() => navigate('/student/dashboard')}
          >
            <ArrowLeft size={16} className="me-2" />
            Back to Dashboard
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Pre-test screen
  if (!testStarted) {
    return (
      <DashboardLayout title="Test Instructions">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <Timer size={24} className="me-2" />
                  {test.Title || test.title}
                </h4>
              </div>
              <div className="card-body p-4">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Clock size={18} className="text-primary me-2" />
                      <strong>Duration: 5 minutes</strong>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <CheckCircle2 size={18} className="text-success me-2" />
                      <span>Questions: {test.questions?.length || 0}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="alert alert-warning">
                      <AlertTriangle size={18} className="me-2" />
                      <strong>Important:</strong> You have exactly 5 minutes to complete this test. 
                      The test will auto-submit when time runs out.
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5>Instructions:</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">• Read each question carefully</li>
                    <li className="mb-2">• Select the best answer for each question</li>
                    <li className="mb-2">• You can change your answers before submitting</li>
                    <li className="mb-2">• The test will automatically submit after 5 minutes</li>
                    <li className="mb-2">• Make sure you have a stable internet connection</li>
                  </ul>
                </div>

                <div className="d-flex justify-content-between">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/student/dashboard')}
                  >
                    <ArrowLeft size={16} className="me-2" />
                    Cancel
                  </button>
                  <button 
                    className="btn btn-primary btn-lg px-4"
                    onClick={startTest}
                  >
                    <Timer size={18} className="me-2" />
                    Start Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Test taking screen
  return (
    <DashboardLayout title="Taking Test">
      {/* Timer Header */}
      <div className="sticky-top bg-white border-bottom shadow-sm mb-4 p-3 rounded">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">{test.Title || test.title}</h5>
            <small className="text-muted">
              Question {Object.keys(answers).length} of {test.questions?.length || 0} answered
            </small>
          </div>
          
          {/* Timer Display */}
          <div className="d-flex align-items-center">
            <div className={`timer-badge bg-${getTimerColor()} text-white ${
              timeLeft <= 60 ? 'timer-danger' : timeLeft <= 120 ? 'timer-warning' : ''
            }`}>
              <Clock size={18} className="me-2" />
              {formatTime(timeLeft)}
            </div>
            
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={submitting || timerExpired}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} className="me-2" />
                  Submit Test
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-2">
          <div className="progress" style={{ height: '4px' }}>
            <div 
              className={`progress-bar bg-${getTimerColor()}`}
              style={{ width: `${(timeLeft / 300) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Timer Expired Warning */}
      {timerExpired && (
        <div className="alert alert-danger" role="alert">
          <AlertTriangle size={18} className="me-2" />
          <strong>Time's Up!</strong> Your test has been automatically submitted.
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Questions */}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {test.questions?.map((question, index) => (
            <div key={question.id || index} className={`card mb-4 border-0 shadow-sm test-question-card ${
              answers[question.id || index] ? 'answered' : ''
            }`}>
              <div className="card-body p-4">
                <div className="d-flex align-items-start mb-3">
                  <span className={`badge me-3 mt-1 ${
                    answers[question.id || index] ? 'bg-success' : 'bg-primary'
                  }`}>
                    {index + 1}
                  </span>
                  <h6 className="mb-0 flex-grow-1">{question.question}</h6>
                </div>
                
                <div className="ms-5">
                  {question.options?.map((option, optionIndex) => (
                    <div key={optionIndex} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`question-${question.id || index}`}
                        id={`q${index}-option${optionIndex}`}
                        value={option}
                        checked={answers[question.id || index] === option}
                        onChange={() => handleAnswerChange(question.id || index, option)}
                        disabled={timerExpired}
                      />
                      <label 
                        className="form-check-label w-100" 
                        htmlFor={`q${index}-option${optionIndex}`}
                        style={{ cursor: timerExpired ? 'not-allowed' : 'pointer' }}
                      >
                        <span className="fw-medium me-2">{String.fromCharCode(65 + optionIndex)}.</span>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Submit Section */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4 text-center">
              <div className="mb-3">
                <h6 className="text-muted">
                  {Object.keys(answers).length} of {test.questions?.length || 0} questions answered
                </h6>
                <div className="progress mt-2" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-success"
                    style={{ 
                      width: `${(Object.keys(answers).length / (test.questions?.length || 1)) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <button
                className="btn btn-primary btn-lg px-5"
                onClick={handleSubmit}
                disabled={submitting || timerExpired}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Submitting Test...
                  </>
                ) : (
                  <>
                    <Send size={18} className="me-2" />
                    Submit Test
                  </>
                )}
              </button>
              
              <div className="mt-3">
                <small className="text-muted">
                  Make sure to review your answers before submitting. You cannot change them after submission.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timer Warning Modal */}
      {timeLeft <= 60 && timeLeft > 0 && (
        <div className="timer-warning-overlay">
          <div className="alert alert-warning shadow-lg border-warning">
            <div className="d-flex align-items-center">
              <AlertTriangle className="text-warning me-2" size={24} />
              <div>
                <strong>Time Warning!</strong>
                <div>Only {formatTime(timeLeft)} remaining!</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TakeTest;
