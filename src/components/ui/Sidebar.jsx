import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  BookOpen, 
  Trophy,
  PlusCircle,
  ClipboardList,
  Clock
} from 'lucide-react';

const Sidebar = ({ userRole = 'student' }) => {
  const location = useLocation();

  const teacherMenuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/teacher/dashboard'
    },
    {
      icon: PlusCircle,
      label: 'Create Test',
      path: '/teacher/create-test'
    },
    {
      icon: FileText,
      label: 'My Tests',
      path: '/teacher/tests'
    },
    {
      icon: ClipboardList,
      label: 'Test Results',
      path: '/teacher/results'
    }
  ];

  const studentMenuItems = [
    {
      icon: Home,
      label: 'Dashboard',
      path: '/student/dashboard'
    },
    {
      icon: BookOpen,
      label: 'Available Tests',
      path: '/student/tests'
    },
    {
      icon: Clock,
      label: 'Timer Demo',
      path: '/student/demo-test'
    },
    {
      icon: Trophy,
      label: 'My Results',
      path: '/student/results'
    }
  ];

  const menuItems = userRole === 'teacher' ? teacherMenuItems : studentMenuItems;

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="sidebar bg-white border-end vh-100 position-sticky top-0">
      <div className="p-3">
        <h6 className="text-muted text-uppercase fw-bold mb-3" style={{ fontSize: '0.75rem', letterSpacing: '0.1em' }}>
          {userRole === 'teacher' ? 'Teacher Panel' : 'Student Panel'}
        </h6>
        
        <nav className="nav flex-column">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = isActiveLink(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link d-flex align-items-center py-2 px-3 rounded mb-1 ${
                  isActive 
                    ? 'active bg-primary text-white' 
                    : 'text-muted hover-bg-light'
                }`}
                style={{ transition: 'all 0.2s ease' }}
              >
                <IconComponent size={18} className="me-3" />
                <span className="fw-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section - could be used for user info or additional links */}
      <div className="mt-auto p-3 border-top">
        <div className="text-center">
          <small className="text-muted">
            AIvalytics v1.0
          </small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
