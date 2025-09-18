import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Play,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../../components/ui/DashboardLayout';
import { useAuth } from '../../lib/AuthContext';
import { apiClient, API_ENDPOINTS } from '../../lib/api/client';

const Tests = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadTests();
    }
  }, [user]);

  const loadTests = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(API_ENDPOINTS.STUDENT_TESTS(user.id));
      
      if (response.success) {
        setTests(response.tests || []);
      } else {
        setError('Failed to load tests');
      }
    } catch (error) {
      console.error('Error loading tests:', error);
      setError('Failed to load tests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Available Tests">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading available tests...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Available Tests">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Available Tests</h1>
          <p className="text-muted mb-0">Select a test to begin your assessment</p>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger" role="alert">
          <AlertCircle size={18} className="me-2" />
          {error}
        </div>
      )}

      {/* Tests Grid */}
      <div className="row">
        {tests.length > 0 ? (
          tests.map((test) => (
            <div key={test.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">{test.Title || test.title}</h5>
                    <span className={`badge bg-${getDifficultyColor(test.difficulty)}`}>
                      {test.difficulty || 'Medium'}
                    </span>
                  </div>
                  
                  <p className="text-muted mb-3">{test.subject}</p>
                  
                  <div className="mb-3">
                    <div className="d-flex align-items-center text-muted small mb-1">
                      <Clock size={14} className="me-2" />
                      Duration: 5 minutes (fixed)
                    </div>
                    <div className="d-flex align-items-center text-muted small mb-1">
                      <BookOpen size={14} className="me-2" />
                      Questions: {test.questions?.length || test.question_count || 'N/A'}
                    </div>
                    <div className="d-flex align-items-center text-muted small">
                      <Users size={14} className="me-2" />
                      Class: {test.class || 'General'}
                    </div>
                  </div>

                  {test.isAttempted ? (
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center text-success">
                        <CheckCircle size={16} className="me-2" />
                        <span className="small">Completed</span>
                      </div>
                      <span className="badge bg-success">
                        {test.previousScore}%
                      </span>
                    </div>
                  ) : (
                    <Link 
                      to={`/student/test/${test.id}`}
                      className="btn btn-primary w-100"
                    >
                      <Play size={16} className="me-2" />
                      Start Test
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="text-center py-5">
              <BookOpen className="text-muted mb-3" size={64} />
              <h4 className="text-muted mb-3">No Tests Available</h4>
              <p className="text-muted">
                No tests have been assigned to you yet. Check back later or contact your teacher.
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Tests;
