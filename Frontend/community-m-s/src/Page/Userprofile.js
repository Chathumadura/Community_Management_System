import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { FaUser, FaEnvelope, FaPhone, FaUserTag, FaClock, FaPlus, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import '../Css/UserProfile.css';
import Navbar2 from "../Page/NavBar2";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [leavingTimes, setLeavingTimes] = useState([]);
  const [editingTime, setEditingTime] = useState(null);
  const [editedTime, setEditedTime] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found");
          setLoading(false);
          return;
        }

        const decoded = jwtDecode(token);
        const userId = id || decoded.id || decoded._id || decoded.userId;

        // Fetch user data
        const userResponse = await fetch(`http://localhost:8070/api/users/${userId}`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const userData = await userResponse.json();

        // Fetch leaving times
        const timesResponse = await fetch(`http://localhost:8070/api/leavetime/${userId}`);
        const timesData = await timesResponse.json();

        if (userResponse.ok) {
          setUser(userData);
          if (timesResponse.ok && timesData.departureTimes) {
            setLeavingTimes(Object.entries(timesData.departureTimes).map(([day, time]) => ({
              day,
              time,
              _id: timesData._id
            })));
          }
        } else {
          setError(userData.error || "Failed to fetch data");
        }
      } catch (err) {
        setError("Error loading data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleTimeUpdate = async (slotId, day, newTime) => {
    try {
      const response = await fetch(`http://localhost:8070/api/leavetime/update-time/${slotId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ day, newTime })
      });

      if (response.ok) {
        setLeavingTimes(prev => prev.map(item => 
          item.day === day ? {...item, time: newTime} : item
        ));
        setEditingTime(null);
      } else {
        throw new Error('Update failed');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update time');
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!user) return <div className="profile-not-found">User not found</div>;

  return (
    <div >
      <Navbar2 />
      <div className="dark-theme">
        
        <div className="profile-container">
          <div className="profile-header">
            <h1>User Profile</h1>
            <button className="action-button" onClick={() => navigate('/leave')}>
              <FaPlus /> Add Leaving Time
            </button>
          </div>

          <div className="profile-content">
            <div className="profile-sidebar">
              <div className="avatar">
                <FaUser size={60} />
              </div>
              <h2>{user.name}</h2>
              <div className="user-badge">
                <FaUserTag /> {user.userType}
              </div>
              <div className="last-login">
                <FaClock /> Last active: {new Date(user.lastLogin).toLocaleString()}
              </div>
            </div>

            <div className="profile-details">
              <section className="detail-section">
                <h3><FaUser /> Personal Info</h3>
                <div className="detail-row">
                  <span>Name:</span>
                  <span>{user.name}</span>
                </div>
                <div className="detail-row">
                  <span>User Type:</span>
                  <span>{user.userType}</span>
                </div>
              </section>

              <section className="detail-section">
                <h3><FaEnvelope /> Contact</h3>
                <div className="detail-row">
                  <span>Email:</span>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </div>
                <div className="detail-row">
                  <span>Phone:</span>
                  <a href={`tel:${user.phoneNumber}`}>{user.phoneNumber}</a>
                </div>
              </section>

              <section className="detail-section">
                <h3><FaClock /> Schedule</h3>
                {leavingTimes.length > 0 ? (
                  <table className="schedule-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Departure Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leavingTimes.map((item, index) => (
                        <tr key={index}>
                          <td>{item.day}</td>
                          <td>
                            {editingTime === index ? (
                              <div className="time-edit">
                                <input 
                                  type="time" 
                                  value={editedTime} 
                                  onChange={(e) => setEditedTime(e.target.value)}
                                />
                                <button onClick={() => handleTimeUpdate(item._id, item.day, editedTime)}>
                                  <FaCheck />
                                </button>
                                <button onClick={() => setEditingTime(null)}>
                                  <FaTimes />
                                </button>
                              </div>
                            ) : (
                              <div className="time-display">
                                {item.time}
                                <button onClick={() => {
                                  setEditingTime(index);
                                  setEditedTime(item.time);
                                }}>
                                  <FaEdit />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No schedule data available</p>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;