import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, Users, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-vh-100">
      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light fixed-top glass-effect">
        <div className="container">
          <Link className="navbar-brand text-gradient fw-bold" to="/">
            <Brain className="me-2" size={32} />
            AIvalytics
          </Link>
          
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-primary btn-sm" to="/auth/login">Login</Link>
            <Link className="btn btn-primary btn-sm" to="/auth/register">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-bg text-white py-5" style={{ marginTop: '76px', minHeight: '100vh' }}>
        <div className="container">
          <div className="row align-items-center justify-content-center min-vh-100">
            <div className="col-lg-8 text-center">
              <div className="fade-in">
                <Brain size={120} className="text-white mb-4" />
                <h1 className="display-3 fw-bold mb-4">
                  AIvalytics
                </h1>
                <p className="lead mb-5 fs-4">
                  AI-Powered MCQ Testing Platform with Smart Timer System
                </p>
                
                {/* Quick Access Buttons */}
                <div className="d-flex flex-wrap justify-content-center gap-4 mb-5">
                  <div className="text-center">
                    <Link to="/auth/register?role=teachers" className="btn btn-light btn-lg px-5 py-3 mb-2 d-block">
                      <Users className="me-2" size={24} />
                      Teacher Access
                    </Link>
                    <small className="text-light opacity-75">Create & manage tests</small>
                  </div>
                  <div className="text-center">
                    <Link to="/auth/login?role=students" className="btn btn-outline-light btn-lg px-5 py-3 mb-2 d-block">
                      <BookOpen className="me-2" size={24} />
                      Student Access
                    </Link>
                    <small className="text-light opacity-75">Take tests & view results</small>
                  </div>
                </div>

                {/* Key Features */}
                <div className="row justify-content-center mt-5">
                  <div className="col-md-4 mb-3">
                    <div className="d-flex flex-column align-items-center text-center">
                      <CheckCircle className="text-success mb-2" size={32} />
                      <span className="fw-medium">5-Minute Timer</span>
                      <small className="text-light opacity-75">Auto-submit system</small>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="d-flex flex-column align-items-center text-center">
                      <CheckCircle className="text-success mb-2" size={32} />
                      <span className="fw-medium">AI-Generated MCQs</span>
                      <small className="text-light opacity-75">Smart question creation</small>
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <div className="d-flex flex-column align-items-center text-center">
                      <CheckCircle className="text-success mb-2" size={32} />
                      <span className="fw-medium">Instant Results</span>
                      <small className="text-light opacity-75">Real-time analytics</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-dark text-light py-3">
        <div className="container text-center">
          <p className="text-muted mb-0">
            &copy; 2024 AIvalytics - Smart MCQ Testing Platform
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
