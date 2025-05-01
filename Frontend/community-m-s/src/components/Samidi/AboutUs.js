import React from "react";
import "../Samidi/MaintenanceStyle.css"; 

function AboutUs() {
    return (
        
        <div className="about-container">
            <h1 className="about-title">About Our Community Management System</h1>
            <p className="about-text">
                Our Community Management System is designed to streamline the day-to-day operations of a residential or commercial community. 
                From handling maintenance requests to managing complaints, staff, parking, and vendor billing — everything is accessible in one place.
            </p>
         
         <div>
            <p className="about-text">
                The goal of this platform is to promote transparency, improve communication, and ensure quick resolution of issues raised by residents. 
                Whether you are a resident, administrator, or a visitor, our system ensures a smooth and efficient experience.
            </p>
            </div>


           <div> <p className="about-text">
                Built using modern technologies like React and Spring Boot, our system is secure, scalable, and user-friendly.
            </p>
            </div>
        </div>
    );
}

export default AboutUs;