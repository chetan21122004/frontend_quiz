import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, LogOut } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

const Navbar = ({ title = 'AIvalytics', showUserMenu = true }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <Brain className="text-primary me-2" size={28} />
          <span className="fw-bold text-gradient">{title}</span>
        </Link>

        {/* Mobile toggle */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          aria-controls="navbarContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="navbar-nav ms-auto">
            {isAuthenticated && showUserMenu ? (
              // User menu dropdown
              <div className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div className="d-flex align-items-center">
                    <div className="avatar-circle bg-primary text-white me-2">
                      {user?.full_name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="d-none d-md-block">
                      <div className="fw-medium">{user?.full_name || user?.name || 'User'}</div>
                      <small className="text-muted text-capitalize">{user?.role || user?.userType}</small>
                    </div>
                  </div>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button 
                      className="dropdown-item d-flex align-items-center text-danger" 
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="me-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              // Login/Register buttons for non-authenticated users
              <div className="d-flex align-items-center gap-2">
                <Link className="nav-link" to="/auth/login">Login</Link>
                <Link className="btn btn-primary btn-sm" to="/auth/register">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
