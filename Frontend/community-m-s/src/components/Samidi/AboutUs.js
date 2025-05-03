import React from "react";
import "../Samidi/MaintenanceStyle.css"; 

function AboutUs() {
    return (
        <div className="about-us-container">
            <div className="about-header">
                <h1 className="about-title">About Our Community Management System</h1>
                <div className="title-underline"></div>
            </div>
            
            <div className="about-content">
                <div className="about-card">
                    <div className="card-icon">🏡</div>
                    <p className="about-text">
                        Our Community Management System is designed to streamline the day-to-day operations of residential or commercial communities. 
                        From handling maintenance requests to managing complaints, staff, parking, and vendor billing — everything is accessible in one place.
                    </p>
                </div>
                
                <div className="about-card">
                    <div className="card-icon">✨</div>
                    <p className="about-text">
                        The goal of this platform is to promote transparency, improve communication, and ensure quick resolution of issues raised by residents. 
                        Whether you're a resident, administrator, or visitor, our system ensures a smooth and efficient experience.
                    </p>
                </div>
                
                <div className="about-card">
                    <div className="card-icon">⚙️</div>
                    <p className="about-text">
                        Built using modern technologies like React and Spring Boot, our system is secure, scalable, and user-friendly, 
                        with a focus on performance and ease of use for all community members.
                    </p>
                </div>
            </div>
            
           
        </div>
    );
}

export default AboutUs;