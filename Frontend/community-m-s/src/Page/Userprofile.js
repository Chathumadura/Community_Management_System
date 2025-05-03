import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { FaUser, FaEnvelope, FaPhone, FaUserTag, FaClock } from 'react-icons/fa';
import '../Css/UserProfile.css';
import Navbar2 from "../Page/NavBar2";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();  // useNavigate hook
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const userId = id || decoded.id || decoded._id || decoded.userId;

        const response = await fetch(`http://localhost:8070/api/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          setError(data.error || "Failed to fetch user");
        }
      } catch (err) {
        setError("⚠️ Server error. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserById();
  }, [id]);

  const handleAddLeavingTime = () => {
    // Navigate to the /leave route
    navigate('/leave');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never logged in';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <div className="profile-loading">Loading user details...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!user) return <div className="profile-not-found">User not found</div>;

  return (
    <div>
        <Navbar2 />
        <div className="profile-container">
            
        <div className="profile-header">
            <h1>User Profile</h1>
            <button className="leaving-time-button" onClick={handleAddLeavingTime}>
            Add Leaving Time
            </button>
        </div>

        <div className="profile-content">
            <div className="profile-left-section">
            <div className="profile-basic-info">
                <h2>{user.name}</h2>
                <div className="user-type-badge">
                <FaUserTag />
                <span>{user.userType}</span>
                </div>
            </div>

            <div className="profile-stats">
                <div className="stat-item">
                <FaClock />
                <div>
                    <span className="stat-label">Last Login</span>
                    <span className="stat-value">{formatDate(user.lastLogin)}</span>
                </div>
                </div>
            </div>
            </div>

            <div className="profile-right-section">
            <div className="profile-detail-card">
                <h3>
                <FaUser />
                <span>Personal Information</span>
                </h3>
                <div className="detail-grid">
                <div className="detail-item">
                    <span className="detail-label">Full Name</span>
                    <span className="detail-value">{user.name}</span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">User Type</span>
                    <span className="detail-value">{user.userType}</span>
                </div>
                </div>
            </div>

            <div className="profile-detail-card">
                <h3>
                <FaEnvelope />
                <span>Contact Information</span>
                </h3>
                <div className="detail-grid">
                <div className="detail-item">
                    <span className="detail-label">Email Address</span>
                    <span className="detail-value">
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                    </span>
                </div>
                <div className="detail-item">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">
                    <a href={`tel:${user.phoneNumber}`}>{user.phoneNumber}</a>
                    </span>
                </div>
                </div>
            </div>

            <div className="profile-detail-card">
                <h3>
                <FaClock />
                <span>Activity Information</span>
                </h3>
                <div className="detail-item full-width">
                <span className="detail-label">Account Created</span>
                <span className="detail-value">{formatDate(user.createdAt)}</span>
                </div>
                <div className="detail-item full-width">
                <span className="detail-label">Last Login</span>
                <span className="detail-value">{formatDate(user.lastLogin)}</span>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

export default UserProfile;
