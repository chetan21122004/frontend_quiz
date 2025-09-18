import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../lib/AuthContext';

const DashboardLayout = ({ children, title = 'Dashboard' }) => {
  const { user } = useAuth();

  return (
    <div className="min-vh-100 bg-light">
      {/* Top Navigation */}
      <Navbar title={title} />
      
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 col-lg-2 px-0">
            <Sidebar userRole={user?.role || user?.userType} />
          </div>
          
          {/* Main Content */}
          <div className="col-md-9 col-lg-10">
            <div className="p-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
