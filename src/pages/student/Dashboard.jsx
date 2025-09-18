import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Trophy, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Star,
  Calendar
} from 'lucide-react';
import DashboardLayout from '../../components/ui/DashboardLayout';
import { useAuth } from '../../lib/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTests: 0,
    completedTests: 0,
    averageScore: 0,
    pendingTests: 0
  });
  const [recentTests, setRecentTests] = useState([]);
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      setStats({
        totalTests: 8,
        completedTests: 5,
        averageScore: 85.4,
        pendingTests: 3
      });

      setRecentTests([
        {
          id: 1,
          title: 'JavaScript Fundamentals',
          subject: 'Programming',
          completedAt: '2024-01-15',
          score: 92,
          totalQuestions: 20,
          correctAnswers: 18
        },
        {
          id: 2,
          title: 'React Components',
          subject: 'Programming',
          completedAt: '2024-01-14',
          score: 78,
          totalQuestions: 15,
          correctAnswers: 12
        },
        {
          id: 3,
          title: 'Database Design',
          subject: 'Database',
          completedAt: '2024-01-12',
          score: 86,
          totalQuestions: 25,
          correctAnswers: 21
        }
      ]);

      setUpcomingTests([
        {
          id: 4,
          title: 'Node.js Basics',
          subject: 'Backend',
          dueDate: '2024-01-20',
          duration: 45,
          questions: 30
        },
        {
          id: 5,
          title: 'CSS Flexbox',
          subject: 'Frontend',
          dueDate: '2024-01-22',
          duration: 30,
          questions: 20
        }
      ]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => (
    <div className="col-md-6 col-lg-3 mb-4">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body">
          <div className="d-flex align-items-center">
            <div className={`p-3 rounded-3 bg-${color} bg-opacity-10 me-3`}>
              <Icon className={`text-${color}`} size={24} />
            </div>
            <div className="flex-grow-1">
              <h3 className="h4 fw-bold mb-0">{value}</h3>
              <p className="text-muted mb-0">{title}</p>
              {subtitle && <small className="text-muted">{subtitle}</small>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const getScoreColor = (score) => {
    if (score >= 90) return 'success';
    if (score >= 75) return 'primary';
    if (score >= 60) return 'warning';
    return 'danger';
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <Star className="text-warning me-1" size={16} />;
    return null;
  };

  if (loading) {
    return (
      <DashboardLayout title="Student Dashboard">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Student Dashboard">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 fw-bold mb-1">Welcome back, {user?.full_name || user?.name}!</h1>
              <p className="text-muted mb-0">Ready to continue your learning journey?</p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/student/tests" className="btn btn-primary">
                <BookOpen size={20} className="me-2" />
                Browse Tests
              </Link>
              <Link to="/student/demo-test" className="btn btn-outline-primary">
                <Clock size={20} className="me-2" />
                Try Timer Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-5">
        <StatCard
          icon={BookOpen}
          title="Total Tests"
          value={stats.totalTests}
          subtitle="Available"
          color="primary"
        />
        <StatCard
          icon={CheckCircle}
          title="Completed"
          value={stats.completedTests}
          subtitle="Tests finished"
          color="success"
        />
        <StatCard
          icon={TrendingUp}
          title="Average Score"
          value={`${stats.averageScore}%`}
          subtitle="Overall performance"
          color="info"
        />
        <StatCard
          icon={Clock}
          title="Pending Tests"
          value={stats.pendingTests}
          subtitle="To complete"
          color="warning"
        />
      </div>

      <div className="row">
        {/* Recent Test Results */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Recent Test Results</h5>
                <Link to="/student/results" className="btn btn-outline-primary btn-sm">
                  View All Results
                </Link>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Test Name</th>
                      <th>Subject</th>
                      <th>Score</th>
                      <th>Completed</th>
                      <th>Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTests.map((test) => (
                      <tr key={test.id}>
                        <td>
                          <div className="fw-medium">{test.title}</div>
                        </td>
                        <td>
                          <span className="text-muted">{test.subject}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {getScoreIcon(test.score)}
                            <span className={`fw-bold text-${getScoreColor(test.score)}`}>
                              {test.score}%
                            </span>
                          </div>
                        </td>
                        <td>
                          <small className="text-muted">{test.completedAt}</small>
                        </td>
                        <td>
                          <small className="text-muted">
                            {test.correctAnswers}/{test.totalQuestions} correct
                          </small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tests & Quick Actions */}
        <div className="col-lg-4">
          {/* Upcoming Tests */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom-0">
              <h5 className="card-title mb-0">Upcoming Tests</h5>
            </div>
            <div className="card-body">
              {upcomingTests.length > 0 ? (
                <div className="d-grid gap-3">
                  {upcomingTests.map((test) => (
                    <div key={test.id} className="border rounded p-3">
                      <h6 className="fw-bold mb-1">{test.title}</h6>
                      <p className="text-muted small mb-2">{test.subject}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          <Calendar size={14} className="me-1" />
                          Due: {test.dueDate}
                        </small>
                        <Link to={`/student/test/${test.id}`} className="btn btn-sm btn-primary">
                          Start Test
                        </Link>
                      </div>
                      <div className="mt-2">
                        <small className="text-muted">
                          <Clock size={12} className="me-1" />
                          {test.duration} min • {test.questions} questions
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="text-success mb-2" size={48} />
                  <p className="text-muted">No upcoming tests!</p>
                  <small className="text-muted">You're all caught up.</small>
                </div>
              )}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom-0">
              <h5 className="card-title mb-0">Performance Overview</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <TrendingUp className="text-success me-2" size={18} />
                <span className="text-muted">Overall Progress: Excellent</span>
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-muted">Completion Rate</small>
                  <small className="fw-bold">{Math.round((stats.completedTests / stats.totalTests) * 100)}%</small>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-primary" 
                    style={{ width: `${(stats.completedTests / stats.totalTests) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-muted">Average Score</small>
                  <small className="fw-bold">{stats.averageScore}%</small>
                </div>
                <div className="progress" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    style={{ width: `${stats.averageScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-top">
                <Link to="/student/performance" className="btn btn-outline-primary btn-sm w-100">
                  View Detailed Analytics
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
