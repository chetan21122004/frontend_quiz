import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { registerTeacher, isAuthenticated, user } = useAuth();

  const role = searchParams.get('role') || 'students';
  const userType = role === 'teachers' ? 'teacher' : 'student';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      if (userType === 'teacher') {
        // Register teacher
        const result = await registerTeacher({
          name: formData.name.trim(),
          email: formData.email.trim()
          // Note: Password handling will be done by the backend
        });

        if (result.success) {
          setSuccess('Account created successfully!');
          setTimeout(() => {
            navigate('/teacher/dashboard');
          }, 1500);
        } else {
          setError(result.error);
        }
      } else {
        // For student registration, we'll implement this later when the backend supports it
        setError('Student registration is not yet implemented. Please contact your teacher for access.');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Back Button */}
      <Link
        to="/"
        className="position-absolute top-0 start-0 m-4 d-flex align-items-center text-decoration-none text-muted"
        style={{ zIndex: 10 }}
      >
        <ArrowLeft size={20} className="me-2" />
        Back to Home
      </Link>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="position-relative">
              {/* Background decoration */}
              <div 
                className="position-absolute w-100 h-100 rounded-4 opacity-75"
                style={{
                  background: role === 'teachers' 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))' 
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.1))',
                  transform: 'rotate(1deg)'
                }}
              ></div>
              
              {/* Main card */}
              <div className="card border-0 shadow-lg position-relative">
                <div className="card-body p-5">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <h1 className="h2 fw-bold mb-2">
                      Join{' '}
                      <span className="text-gradient">AIvalytics</span>
                    </h1>
                    <p className="text-muted">
                      Create your {userType} account
                    </p>
                  </div>

                  {/* Success Alert */}
                  {success && (
                    <div className="alert alert-success" role="alert">
                      {success}
                    </div>
                  )}

                  {/* Error Alert */}
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <div className="position-relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control pe-5"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Create a password"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ zIndex: 5 }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <small className="text-muted">Password must be at least 6 characters long</small>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </label>
                      <div className="position-relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="form-control pe-5"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          className="btn btn-link position-absolute end-0 top-50 translate-middle-y pe-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{ zIndex: 5 }}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className={`btn w-100 py-3 fw-semibold ${
                        role === 'teachers' ? 'btn-success' : 'btn-primary'
                      } ${loading ? 'disabled' : ''}`}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </span>
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </form>

                  {/* Login Link */}
                  <div className="text-center mt-4">
                    <span className="text-muted">Already have an account? </span>
                    <Link
                      to={`/auth/login?role=${role}`}
                      className={`text-decoration-none fw-medium ${
                        role === 'teachers' ? 'text-success' : 'text-primary'
                      }`}
                    >
                      Sign In
                    </Link>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
