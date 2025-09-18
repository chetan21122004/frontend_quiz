import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  ArrowLeft, 
  Send, 
  AlertTriangle,
  Play,
  Timer
} from 'lucide-react';
import DashboardLayout from '../../components/ui/DashboardLayout';
import { useAuth } from '../../lib/AuthContext';
import { useTimer } from '../../components/ui/Timer';

const DemoTest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Demo test data
  const demoTest = {
    id: 'demo-1',
    title: 'JavaScript Fundamentals Demo',
    subject: 'Programming',
    difficulty: 'Easy',
    questions: [
      {
        id: 1,
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var myVar = 5;', 'variable myVar = 5;', 'v myVar = 5;', 'declare myVar = 5;'],
        correctAnswer: 'var myVar = 5;'
      },
      {
        id: 2,
        question: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'add()', 'append()', 'insert()'],
        correctAnswer: 'push()'
      },
      {
        id: 3,
        question: 'What does "DOM" stand for?',
        options: ['Document Object Model', 'Data Object Management', 'Dynamic Object Method', 'Document Oriented Model'],
        correctAnswer: 'Document Object Model'
      },
      {
        id: 4,
        question: 'Which operator is used for strict equality in JavaScript?',
        options: ['==', '===', '=', '!='],
        correctAnswer: '==='
      },
      {
        id: 5,
        question: 'What is the result of typeof null in JavaScript?',
        options: ['null', 'undefined', 'object', 'string'],
        correctAnswer: 'object'
      }
    ]
  };

  const [testStarted, setTestStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Timer hook with 5 minutes (300 seconds)
  const timer = useTimer(300, handleTimeUp);

  function handleTimeUp() {
    alert('⏰ Time\'s up! Test auto-submitted.');
    handleSubmit(true);
  }

  const startTest = () => {
    setTestStarted(true);
    setStartTime(new Date());
    timer.start();
  };

  const handleAnswerChange = (questionId, selectedAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: selectedAnswer
    }));
  };

  const handleSubmit = async (autoSubmitted = false) => {
    setSubmitting(true);
    timer.pause();
    
    // Calculate results
    const correctAnswers = demoTest.questions.filter(q => 
      answers[q.id] === q.correctAnswer
    ).length;
    
    const percentage = Math.round((correctAnswers / demoTest.questions.length) * 100);
    const timeTaken = startTime ? Math.floor((new Date() - startTime) / 1000) : 0;

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const submissionResult = {
      testId: demoTest.id,
      studentId: user.id,
      correctAnswers,
      totalQuestions: demoTest.questions.length,
      percentage,
      timeTaken,
      answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId: parseInt(questionId),
        selectedAnswer,
        isCorrect: demoTest.questions.find(q => q.id === parseInt(questionId))?.correctAnswer === selectedAnswer
      }))
    };

    navigate('/student/results', { 
      state: { 
        submissionResult,
        autoSubmitted,
        isDemo: true
      }
    });
  };

  // Pre-test screen
  if (!testStarted) {
    return (
      <DashboardLayout title="Demo Test">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <Timer size={24} className="me-2" />
                  {demoTest.title}
                </h4>
              </div>
              <div className="card-body p-4">
                <div className="alert alert-info mb-4">
                  <AlertTriangle size={18} className="me-2" />
                  <strong>Demo Test:</strong> This is a demonstration of the 5-minute timer feature. 
                  Try it out to see how the timer works!
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-center mb-2">
                      <Clock size={18} className="text-primary me-2" />
                      <strong>Duration: 5 minutes</strong>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                      <Play size={18} className="text-success me-2" />
                      <span>Questions: {demoTest.questions.length}</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="alert alert-warning">
                      <AlertTriangle size={18} className="me-2" />
                      <strong>Timer Features:</strong>
                      <ul className="mb-0 mt-2">
                        <li>5-minute countdown</li>
                        <li>Visual progress bar</li>
                        <li>Warning at 2 minutes</li>
                        <li>Alert at 1 minute</li>
                        <li>Auto-submit when time expires</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h5>Instructions:</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">• Read each question carefully</li>
                    <li className="mb-2">• Select the best answer for each question</li>
                    <li className="mb-2">• Watch the timer in the top-right corner</li>
                    <li className="mb-2">• The test will automatically submit after 5 minutes</li>
                    <li className="mb-2">• You can submit early if you finish before time runs out</li>
                  </ul>
                </div>

                <div className="d-flex justify-content-between">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/student/dashboard')}
                  >
                    <ArrowLeft size={16} className="me-2" />
                    Back to Dashboard
                  </button>
                  <button 
                    className="btn btn-primary btn-lg px-4"
                    onClick={startTest}
                  >
                    <Timer size={18} className="me-2" />
                    Start Demo Test
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
    <DashboardLayout title="Demo Test">
      {/* Timer Header */}
      <div className="sticky-top bg-white border-bottom shadow-sm mb-4 p-3 rounded">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="mb-0">{demoTest.title}</h5>
            <small className="text-muted">
              Question {Object.keys(answers).length} of {demoTest.questions.length} answered
            </small>
          </div>
          
          {/* Timer Display */}
          <div className="d-flex align-items-center">
            <div className={`timer-badge bg-${timer.getTimerColor()} text-white ${
              timer.timeLeft <= 30 ? 'timer-danger' : timer.timeLeft <= 60 ? 'timer-warning' : ''
            }`}>
              <Clock size={18} className="me-2" />
              {timer.formatTime()}
            </div>
            
            <button
              className="btn btn-primary ms-3"
              onClick={() => handleSubmit(false)}
              disabled={submitting || timer.isExpired}
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
              className={`progress-bar bg-${timer.getTimerColor()}`}
              style={{ width: `${timer.percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Timer Expired Warning */}
      {timer.isExpired && (
        <div className="alert alert-danger" role="alert">
          <AlertTriangle size={18} className="me-2" />
          <strong>Time's Up!</strong> Your test has been automatically submitted.
        </div>
      )}

      {/* Questions */}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {demoTest.questions.map((question, index) => (
            <div key={question.id} className={`card mb-4 border-0 shadow-sm test-question-card ${
              answers[question.id] ? 'answered' : ''
            }`}>
              <div className="card-body p-4">
                <div className="d-flex align-items-start mb-3">
                  <span className={`badge me-3 mt-1 ${
                    answers[question.id] ? 'bg-success' : 'bg-primary'
                  }`}>
                    {index + 1}
                  </span>
                  <h6 className="mb-0 flex-grow-1">{question.question}</h6>
                </div>
                
                <div className="ms-5">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`question-${question.id}`}
                        id={`q${question.id}-option${optionIndex}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswerChange(question.id, option)}
                        disabled={timer.isExpired}
                      />
                      <label 
                        className="form-check-label w-100" 
                        htmlFor={`q${question.id}-option${optionIndex}`}
                        style={{ cursor: timer.isExpired ? 'not-allowed' : 'pointer' }}
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
                  {Object.keys(answers).length} of {demoTest.questions.length} questions answered
                </h6>
                <div className="progress mt-2" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-success"
                    style={{ 
                      width: `${(Object.keys(answers).length / demoTest.questions.length) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
              
              <button
                className="btn btn-primary btn-lg px-5"
                onClick={() => handleSubmit(false)}
                disabled={submitting || timer.isExpired}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Submitting Test...
                  </>
                ) : (
                  <>
                    <Send size={18} className="me-2" />
                    Submit Demo Test
                  </>
                )}
              </button>
              
              <div className="mt-3">
                <small className="text-muted">
                  This is a demo test to showcase the 5-minute timer functionality.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timer Warning Modal */}
      {timer.timeLeft <= 60 && timer.timeLeft > 0 && (
        <div className="timer-warning-overlay">
          <div className="alert alert-warning shadow-lg border-warning">
            <div className="d-flex align-items-center">
              <AlertTriangle className="text-warning me-2" size={24} />
              <div>
                <strong>Time Warning!</strong>
                <div>Only {timer.formatTime()} remaining!</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DemoTest;
