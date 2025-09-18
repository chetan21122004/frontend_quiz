import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Clock, 
  Trophy,
  User,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import DashboardLayout from '../../components/ui/DashboardLayout';
import { useAuth } from '../../lib/AuthContext';
import { apiClient, API_ENDPOINTS } from '../../lib/api/client';

const SubmittedTests = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user?.id) {
      loadSubmissions();
    }
  }, [user, currentPage]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await apiClient.get(API_ENDPOINTS.TEST_SUBMISSIONS, {
        teacherId: user.id,
        page: currentPage,
        limit: 10
      });

      if (response.success) {
        setSubmissions(response.submissions || []);
        setTotalPages(response.pagination?.totalPages || 1);
      } else {
        setError('Failed to load submitted tests');
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      setError('Failed to load submitted tests. Please check if the database tables exist.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (submission) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.TEST_SUBMISSION_DETAIL(submission.id));
      
      if (response.success) {
        setSelectedSubmission(response.submission);
        setShowDetailModal(true);
      } else {
        setError('Failed to load submission details');
      }
    } catch (error) {
      console.error('Error loading submission details:', error);
      setError('Failed to load submission details');
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const studentName = submission.students?.full_name?.toLowerCase() || '';
    const testName = submission.tests?.title?.toLowerCase() || '';
    
    return studentName.includes(searchLower) || testName.includes(searchLower);
  });

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'primary';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading && submissions.length === 0) {
    return (
      <DashboardLayout title="Submitted Tests">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading submitted tests...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Submitted Tests">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Submitted Tests</h1>
          <p className="text-muted mb-0">View and analyze student test submissions</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <XCircle size={18} className="me-2" />
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by student name or test name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <button
                className="btn btn-outline-primary"
                onClick={loadSubmissions}
                disabled={loading}
              >
                <Filter size={16} className="me-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {filteredSubmissions.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Student</th>
                    <th>Test</th>
                    <th>Score</th>
                    <th>Time Taken</th>
                    <th>Submitted At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-circle bg-primary text-white me-3">
                            <User size={16} />
                          </div>
                          <div>
                            <div className="fw-medium">
                              {submission.students?.full_name || 'Unknown Student'}
                            </div>
                            <small className="text-muted">
                              {submission.students?.email || ''}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-medium">
                            {submission.tests?.title || 'Unknown Test'}
                          </div>
                          <small className="text-muted">
                            {submission.tests?.subject} • {submission.tests?.difficulty}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className={`badge bg-${getScoreColor(submission.score)} me-2`}>
                            {submission.score}%
                          </span>
                          <small className="text-muted">
                            {submission.correct_answers}/{submission.total_questions}
                          </small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center text-muted">
                          <Clock size={14} className="me-1" />
                          {formatDuration(submission.time_taken || 0)}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center text-muted">
                          <Calendar size={14} className="me-1" />
                          <small>{formatDate(submission.completed_at)}</small>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => handleViewDetails(submission)}
                        >
                          <Eye size={14} className="me-1" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <FileText className="text-muted mb-3" size={64} />
              <h4 className="text-muted mb-3">No Submitted Tests Found</h4>
              <p className="text-muted">
                {searchQuery 
                  ? 'No submissions match your search criteria.' 
                  : 'No students have submitted tests yet, or the database tables may not be set up.'
                }
              </p>
              {!searchQuery && (
                <button
                  className="btn btn-primary mt-3"
                  onClick={loadSubmissions}
                >
                  Retry Loading
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-backdrop fade show"></div>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Test Submission Details
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDetailModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* Submission Summary */}
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6 className="fw-bold">Student Information</h6>
                    <p className="mb-1">
                      <strong>Name:</strong> {selectedSubmission.students?.full_name}
                    </p>
                    <p className="mb-1">
                      <strong>Email:</strong> {selectedSubmission.students?.email}
                    </p>
                    <p className="mb-0">
                      <strong>Class:</strong> {selectedSubmission.students?.class || selectedSubmission.tests?.class}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-bold">Test Information</h6>
                    <p className="mb-1">
                      <strong>Test:</strong> {selectedSubmission.tests?.title}
                    </p>
                    <p className="mb-1">
                      <strong>Subject:</strong> {selectedSubmission.tests?.subject}
                    </p>
                    <p className="mb-0">
                      <strong>Difficulty:</strong> {selectedSubmission.tests?.difficulty}
                    </p>
                  </div>
                </div>

                {/* Performance Summary */}
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="text-center">
                      <div className={`display-6 fw-bold text-${getScoreColor(selectedSubmission.score)}`}>
                        {selectedSubmission.score}%
                      </div>
                      <small className="text-muted">Final Score</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <div className="display-6 fw-bold text-success">
                        {selectedSubmission.correct_answers}
                      </div>
                      <small className="text-muted">Correct Answers</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <div className="display-6 fw-bold text-info">
                        {formatDuration(selectedSubmission.time_taken || 0)}
                      </div>
                      <small className="text-muted">Time Taken</small>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="text-center">
                      <div className="display-6 fw-bold text-primary">
                        {selectedSubmission.total_questions}
                      </div>
                      <small className="text-muted">Total Questions</small>
                    </div>
                  </div>
                </div>

                {/* Questions and Answers */}
                {selectedSubmission.answers && (
                  <div>
                    <h6 className="fw-bold mb-3">Question-by-Question Analysis</h6>
                    {selectedSubmission.answers.map((answer, index) => (
                      <div key={index} className="card mb-3">
                        <div className="card-body">
                          <div className="d-flex align-items-start justify-content-between mb-2">
                            <h6 className="mb-0">Question {index + 1}</h6>
                            {answer.is_correct ? (
                              <CheckCircle className="text-success" size={20} />
                            ) : (
                              <XCircle className="text-danger" size={20} />
                            )}
                          </div>
                          
                          <div className="mb-3">
                            <strong>Selected Answer:</strong>
                            <span className={`ms-2 badge ${answer.is_correct ? 'bg-success' : 'bg-danger'}`}>
                              {answer.selected_answer}
                            </span>
                          </div>
                          
                          {!answer.is_correct && (
                            <div>
                              <strong>Correct Answer:</strong>
                              <span className="ms-2 badge bg-success">
                                {answer.correct_answer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SubmittedTests;
