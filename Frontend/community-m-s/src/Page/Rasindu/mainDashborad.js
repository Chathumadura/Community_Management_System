import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faSignOutAlt,
  faFileInvoiceDollar,
  faUserCog,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import "../../Css/Rasindu/maindash.css";


const Dashboard = () => {
  const navigate = useNavigate();
  const employeeName = "John Doe"; // This should ideally come from context or API

  const handleLogout = () => {
    // Example: clear user token/session if needed
    localStorage.removeItem('userToken');
    navigate('/');
  };

  const adminButtons = [
    {
      id: 1,
      icon: faUserCog,
      title: "Manage Employees",
      description: "Add, edit, or remove employee records",
      color: "#e74a3b",
      path: "/empdashboard"
    },
    {
      id: 2,
      icon: faCalendarAlt,
      title: "Manage parking",
      description: "Monitor and adjust attendance logs",
      color: "#858796",
      path: "/security"
    },

    {
      id: 3,
      icon: faCalendarAlt,
      title: "Manage parking",
      description: "Monitor and adjust attendance logs",
      color: "#858796",
      path: "/demoparking"
    },
   
    {
      id: 4,
      icon: faChartLine,
      title: "Reports & Analytics",
      description: "View and export performance reports",
      color: "#fd7e14",
      path: "/admin/reports"
    }

   
  ];

  return (
    <div className="mra-dashboard-container">
      <header className="mra-dashboard-header">
        <h1>Welcome...!</h1>
        <button 
          className="logout-button"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </header>
      
      <div className="mra-quick-stats">
        <div className="mra-stat-card">
          <h3>24</h3>
          <p>Working Days</p>
        </div>
        <div className="mra-stat-card">
            <h3>Date</h3>
            <p>{new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
            })}</p>
        </div>

        <div className="mra-stat-card">
          <h3>98%</h3>
          <p>Attendance</p>
        </div>
      </div>

      {/* Admin section */}
      <div className="mra-admin-grid">
        <h2>Admin Dashboard</h2>
        
        <div className="mra-action-grid">
          {adminButtons.map((button) => (
            <div 
              key={button.id}
              className="mra-action-card"
              style={{ borderTop: `4px solid ${button.color}` }}
              onClick={() => navigate(button.path)}
            >
              <div className="mra-action-icon" style={{ color: button.color }}>
                <FontAwesomeIcon icon={button.icon} />
              </div>
              <h3 style={{ 
                color: '#ffffff', // White text
                fontSize: '1.2rem',
                fontWeight: '600',
                marginBottom: '0.5rem'
              }}>
                {button.title}
              </h3>
              <p style={{
                color: '#a0a0a0', // Light gray text
                fontSize: '0.9rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                {button.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mra-recent-activity">
        <h2>Recent Activity</h2>
        <ul>
          <li>Attendance marked - Today at 08:05 AM</li>
          <li>Salary credited - 25th May 2023</li>
          <li>Profile updated - 20th May 2023</li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
