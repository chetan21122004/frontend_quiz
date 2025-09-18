import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy,
  ArrowLeft,
  BarChart3
} from 'lucide-react';
import DashboardLayout from '../../components/ui/DashboardLayout';

const TestResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { submissionResult, autoSubmitted, isDemo } = location.state || {};

  if (!submissionResult) {
    return (
      <DashboardLayout title="Test Results">
        <div className="text-center py-5">
          <XCircle className="text-danger mb-3" size={48} />
          <h4 className="text-danger mb-3">No Results Found</h4>
          <p className="text-muted mb-4">No test results were found.</p>
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

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'primary';
    if (percentage >= 60) return 'warning';
    return 'danger';
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 90) return 'Excellent work! 🌟';
    if (percentage >= 75) return 'Great job! 👏';
    if (percentage >= 60) return 'Good effort! 👍';
    return 'Keep practicing! 💪';
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <DashboardLayout title="Test Results">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Demo notification */}
          {isDemo && (
            <div className="alert alert-info mb-4" role="alert">
              <CheckCircle size={18} className="me-2" />
              <strong>Demo Completed:</strong> This was a demonstration of the 5-minute timer feature.
            </div>
          )}

          {/* Auto-submit notification */}
          {autoSubmitted && (
            <div className="alert alert-warning mb-4" role="alert">
              <Clock size={18} className="me-2" />
              <strong>Time Expired:</strong> Your test was automatically submitted when the 5-minute timer ended.
            </div>
          )}

          {/* Results Card */}
          <div className="card border-0 shadow-lg mb-4">
            <div className={`card-header bg-${getScoreColor(submissionResult.percentage)} text-white`}>
              <div className="d-flex align-items-center">
                <Trophy size={24} className="me-2" />
                <h4 className="mb-0">Test Completed!</h4>
              </div>
            </div>
            
            <div className="card-body p-4">
              {/* Score Display */}
              <div className="text-center mb-4">
                <div className={`display-4 fw-bold text-${getScoreColor(submissionResult.percentage)} mb-2`}>
                  {submissionResult.percentage}%
                </div>
                <h5 className="text-muted mb-3">
                  {getScoreMessage(submissionResult.percentage)}
                </h5>
                <p className="lead">
                  You scored {submissionResult.correctAnswers} out of {submissionResult.totalQuestions} questions correctly
                </p>
              </div>

              {/* Stats Grid */}
              <div className="row text-center mb-4">
                <div className="col-md-3 mb-3">
                  <div className="stats-card">
                    <CheckCircle className="text-success mb-2" size={32} />
                    <div className="stats-number text-success">{submissionResult.correctAnswers}</div>
                    <div className="stats-label">Correct</div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stats-card">
                    <XCircle className="text-danger mb-2" size={32} />
                    <div className="stats-number text-danger">
                      {submissionResult.totalQuestions - submissionResult.correctAnswers}
                    </div>
                    <div className="stats-label">Incorrect</div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stats-card">
                    <Clock className="text-info mb-2" size={32} />
                    <div className="stats-number text-info">
                      {formatTime(submissionResult.timeTaken || 0)}
                    </div>
                    <div className="stats-label">Time Taken</div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stats-card">
                    <Trophy className="text-warning mb-2" size={32} />
                    <div className={`stats-number text-${getScoreColor(submissionResult.percentage)}`}>
                      {submissionResult.percentage}%
                    </div>
                    <div className="stats-label">Final Score</div>
                  </div>
                </div>
              </div>

              {/* Performance Analysis */}
              <div className="border-top pt-4">
                <h6 className="mb-3">Performance Analysis</h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-medium">Accuracy Rate</label>
                      <div className="progress" style={{ height: '12px' }}>
                        <div 
                          className={`progress-bar bg-${getScoreColor(submissionResult.percentage)}`}
                          style={{ width: `${submissionResult.percentage}%` }}
                        >
                          {submissionResult.percentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-medium">Completion Rate</label>
                      <div className="progress" style={{ height: '12px' }}>
                        <div 
                          className="progress-bar bg-info"
                          style={{ width: '100%' }}
                        >
                          100%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-flex justify-content-center gap-3 mt-4">
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/student/dashboard')}
                >
                  <ArrowLeft size={16} className="me-2" />
                  Back to Dashboard
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/student/results')}
                >
                  <BarChart3 size={16} className="me-2" />
                  View All Results
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default TestResults;
