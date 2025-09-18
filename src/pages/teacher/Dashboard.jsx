import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  FileText, 
  Users, 
  BarChart3, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import DashboardLayout from '../../components/ui/DashboardLayout';
import { useAuth } from '../../lib/AuthContext';
import { apiClient, API_ENDPOINTS } from '../../lib/api/client';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTests: 0,
    activeTests: 0,
    totalStudents: 0,
    completedTests: 0
  });
  const [recentTests, setRecentTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // For now, we'll use mock data since the backend tables might not be set up
      // In a real implementation, you would fetch data from your API endpoints
      
      // Mock data for demonstration
      setStats({
        totalTests: 12,
        activeTests: 3,
        totalStudents: 45,
        completedTests: 128
      });

      setRecentTests([
        {
          id: 1,
          title: 'JavaScript Fundamentals',
          subject: 'Programming',
          createdAt: '2024-01-15',
          status: 'active',
          participants: 25
        },
        {
          id: 2,
          title: 'React Components',
          subject: 'Programming', 
          createdAt: '2024-01-14',
          status: 'completed',
          participants: 30
        },
        {
          id: 3,
          title: 'Database Design',
          subject: 'Database',
          createdAt: '2024-01-12',
          status: 'draft',
          participants: 0
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'success', text: 'Active' },
      completed: { color: 'primary', text: 'Completed' },
      draft: { color: 'warning', text: 'Draft' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`badge bg-${config.color} bg-opacity-10 text-${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <DashboardLayout title="Teacher Dashboard">
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
    <DashboardLayout title="Teacher Dashboard">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 fw-bold mb-1">Welcome back, {user?.full_name || user?.name}!</h1>
              <p className="text-muted mb-0">Here's what's happening with your tests today.</p>
            </div>
            <Link to="/teacher/create-test" className="btn btn-primary">
              <PlusCircle size={20} className="me-2" />
              Create New Test
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-5">
        <StatCard
          icon={FileText}
          title="Total Tests"
          value={stats.totalTests}
          subtitle="All time"
          color="primary"
        />
        <StatCard
          icon={Clock}
          title="Active Tests"
          value={stats.activeTests}
          subtitle="Currently running"
          color="success"
        />
        <StatCard
          icon={Users}
          title="Total Students"
          value={stats.totalStudents}
          subtitle="Enrolled"
          color="info"
        />
        <StatCard
          icon={CheckCircle}
          title="Completed Tests"
          value={stats.completedTests}
          subtitle="This month"
          color="warning"
        />
      </div>

      <div className="row">
        {/* Recent Tests */}
        <div className="col-lg-8 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom-0">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">Recent Tests</h5>
                <Link to="/teacher/tests" className="btn btn-outline-primary btn-sm">
                  View All
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
                      <th>Created</th>
                      <th>Status</th>
                      <th>Participants</th>
                      <th>Actions</th>
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
                          <small className="text-muted">{test.createdAt}</small>
                        </td>
                        <td>
                          {getStatusBadge(test.status)}
                        </td>
                        <td>
                          <span className="text-muted">{test.participants}</span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-primary btn-sm">View</button>
                            <button className="btn btn-outline-secondary btn-sm">Edit</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-bottom-0">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="d-grid gap-3">
                <Link to="/teacher/create-test" className="btn btn-primary">
                  <PlusCircle size={18} className="me-2" />
                  Create New Test
                </Link>
                <Link to="/teacher/results" className="btn btn-outline-primary">
                  <TrendingUp size={18} className="me-2" />
                  View Test Results
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
