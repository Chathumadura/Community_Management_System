import React, { useState } from "react";
import "../../Css/Rasindu/EmployeeForm.css";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUserPlus } from 'react-icons/fa';

const AddEmployee = () => {
    const [employeeData, setEmployeeData] = useState({
        name: "",
        address: "",
        contact: "",
        email: "",
        role: "",
        hourlyRate: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        if (
            !employeeData.name ||
            !employeeData.address ||
            !employeeData.contact ||
            !employeeData.email ||
            !employeeData.role ||
            !employeeData.hourlyRate
        ) {
            setError("All fields must be filled out.");
            return false;
        }

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(employeeData.email)) {
            setError("Invalid email address.");
            return false;
        }

        const contactPattern = /^[0-9]{10}$/;
        if (!contactPattern.test(employeeData.contact)) {
            setError("Contact number must have 10 digits.");
            return false;
        }

        return true;
    };

    const handleChange = (e) => {
        setEmployeeData({ ...employeeData, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const res = await fetch("http://localhost:8070/employee/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(employeeData),
            });

            const data = await res.json();
            if (data.error) {
                setError(data.error);
            } else {
                alert("Employee added successfully!");
                setEmployeeData({
                    name: "",
                    address: "",
                    contact: "",
                    email: "",
                    role: "",
                    hourlyRate: "",
                });
            }
        } catch (err) {
            setError("Error submitting: " + err.message);
        }
    };

    return (
        <div className="fbody">
            <div className="registerA">
                <h2 className="titleA">Register Employee</h2>
                {error && <p className="error-messageA">{error}</p>}

                <form onSubmit={handleSubmit} className="form-containerA">
                    <button 
                        type="button" 
                        className="back-button" 
                        onClick={() => navigate(-1)}
                    >
                        <FaArrowLeft /> Back
                    </button>
                    
                    <div>
                        <label>Name:</label>
                        <input 
                            className="inA" 
                            type="text" 
                            name="name" 
                            value={employeeData.name} 
                            onChange={handleChange} 
                            placeholder="Enter full name"
                            required 
                        />
                    </div>
                    <div>
                        <label>Address:</label>
                        <input 
                            className="inA" 
                            type="text" 
                            name="address" 
                            value={employeeData.address} 
                            onChange={handleChange} 
                            placeholder="Enter address"
                            required 
                        />
                    </div>
                    <div>
                        <label>Contact:</label>
                        <input 
                            className="inA" 
                            type="text" 
                            name="contact" 
                            value={employeeData.contact} 
                            onChange={handleChange} 
                            placeholder="10-digit phone number"
                            required 
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input 
                            className="inA" 
                            type="email" 
                            name="email" 
                            value={employeeData.email} 
                            onChange={handleChange} 
                            placeholder="example@email.com"
                            required 
                        />
                    </div>
                    <div>
                        <label>Role:</label>
                        <select 
                            className="inA" 
                            name="role" 
                            value={employeeData.role} 
                            onChange={handleChange} 
                            required
                        >
                            <option value="">Select Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Security">Security</option>
                            <option value="Cleaners">Cleaners</option>
                            <option value="Resident services">Resident Services</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </div>
                    <div>
                        <label>Hourly Rate:</label>
                        <input 
                            className="inA" 
                            type="number" 
                            name="hourlyRate"
                            min="0" 
                            step="0.01"
                            value={employeeData.hourlyRate} 
                            onChange={handleChange} 
                            placeholder="Enter hourly rate"
                            required 
                        />
                    </div>

                    <button className="subtn" type="submit">
                        <FaUserPlus style={{ marginRight: '8px' }} /> Register Employee
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;
