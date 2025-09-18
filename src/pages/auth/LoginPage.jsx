import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, user } = useAuth();
  
  const role = searchParams.get('role') || 'student';
  const userType = role === 'teachers' ? 'teacher' : 'student';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      const from = location.state?.from?.pathname || redirectPath;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(email, password, userType);
      
      if (result.success) {
        const redirectPath = result.data.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
        const from = location.state?.from?.pathname || redirectPath;
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
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
          <div className="col-md-6 col-lg-4">
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
                      Welcome to{' '}
                      <span className="text-gradient">AIvalytics</span>
                    </h1>
                    <p className="text-muted">
                      Sign in to your {userType} account
                    </p>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
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
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="rememberMe"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="form-check-label text-sm" htmlFor="rememberMe">
                          Remember me
                        </label>
                      </div>
                      
                      <Link
                        to="/auth/forgot-password"
                        className={`text-decoration-none small ${
                          role === 'teachers' ? 'text-success' : 'text-primary'
                        }`}
                      >
                        Forgot password?
                      </Link>
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
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </form>

                  {/* Register Link */}
                  <div className="text-center mt-4">
                    <span className="text-muted">Don't have an account? </span>
                    <Link
                      to={`/auth/register?role=${role}`}
                      className={`text-decoration-none fw-medium ${
                        role === 'teachers' ? 'text-success' : 'text-primary'
                      }`}
                    >
                      Create Account
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

export default LoginPage;
