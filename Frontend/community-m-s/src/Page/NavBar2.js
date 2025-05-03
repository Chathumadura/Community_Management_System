import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Css/navBar.css';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import logo from '../image/logo.png';

function Navbar(){
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate('/'); 
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const navigateToMarketplace = () => {
    closeMenus();
    navigate('/productList');
  };

  const navigateToProfile = () => {
    closeMenus();
    navigate('/ResidentDash');
  };

  const styles = {
    logoutBtn: {
      backgroundColor: '#ff4d4f',
      color: '#fff',
      padding: '10px 20px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
    },
    profileBtn: {
      backgroundColor: '#1890ff',
      color: '#fff',
      padding: '10px 20px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      marginRight: '10px'
    }
  };
  

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo-container">
          <Link to="/" className="navbar-logo" onClick={closeMenus}>
            <img src={logo} alt="Apartment CMS Logo" className="logo-image" />
          </Link>
        </div>

        <div className="menu-icon" onClick={toggleMobileMenu}>
          <i className={isMobileMenuOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>

        <ul className={isMobileMenuOpen ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMenus}>
              Home
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/aboutus" className="nav-links" onClick={closeMenus}>
              About Us
            </Link>
          </li>

          <li className={`nav-item dropdown ${isDropdownOpen ? 'active' : ''}`}>
            <span className="nav-links dropdown-toggle" onClick={toggleDropdown}>
              Features ▾
            </span>
            <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
              <li>
                <span className="dropdown-link" onClick={navigateToMarketplace}>
                  Marketplace
                </span>
              </li>
              
              <li>
                <Link to="/vehicleRegisterForm" className="dropdown-link" onClick={closeMenus}>
                Vehicle Registration
                </Link>
              </li>
              <li className="dropdown-link">
                <Link to="/Maintenance" className="nav-links" onClick={closeMenus}>
                Maintenance
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <Link to="/contact" className="nav-links" onClick={closeMenus}>
              Contact Us
            </Link>
          </li>
          
        </ul>

        <div className="navbar-buttons">
          <button style={styles.profileBtn} onClick={navigateToProfile}>
            <FaUser style={{ marginRight: '8px' }} />
            Profile
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: '8px' }} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;