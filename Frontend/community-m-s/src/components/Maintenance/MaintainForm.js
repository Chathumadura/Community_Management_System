import React, { useState } from "react";
import axios from "axios";
import "../Samidi/MaintenanceStyle.css"; 

function MaintenanceForm() {
    const [FlatID, setFlatID] = useState("");
    const [ResidentName, setResidentName] = useState("");
    const [phone, setphone] = useState("");
    const [MaintenanceType, setMaintenanceType] = useState("");
    const [description, setdescription] = useState("");
    const [AvailableTime, setAvailableTime] = useState("");

    // State variables for validation
    const [FlatIDError, setFlatIDError] = useState("");
    const [ResidentNameError, setResidentNameError] = useState("");
    const [phoneError, setphoneError] = useState("");
    const [MaintenanceTypeError, setMaintenanceTypeError] = useState("");
    const [descriptionError, setdescriptionError] = useState("");
    const [AvailableTimeError, setAvailableTimeError] = useState("");

    const clearForm = () => {
        setFlatID("");
        setResidentName("");
        setphone("");
        setMaintenanceType("");
        setdescription("");
        setAvailableTime("");
    };

    const sendData = (e) => {
        e.preventDefault();

        // Validation checks
        if (!FlatID) {
            setFlatIDError("FlatID is Required.");
            return;
        } else {
            setFlatIDError("");
        }

        if (!ResidentName) {
            setResidentNameError("Resident Name is Required.");
            return;
        } else {
            setResidentNameError("");
        }

        if (!phone) {
            setphoneError("Phone Number is Required.");
            return;
        } else if (!/^\d{10}$/.test(phone)) {
            setphoneError("Invalid Phone Number. Must be 10 digits.");
            return;
        } else {
            setphoneError("");
        }

        if (!MaintenanceType) {
            setMaintenanceTypeError("Maintenance Type is Required.");
            return;
        } else {
            setMaintenanceTypeError("");
        }

        if (!description.trim()) {
            setdescriptionError("Description is Required.");
            return;
        } else {
            setdescriptionError("");
        }

        
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;

        if (!AvailableTime) {
            setAvailableTimeError("Available Time is Required.");
            return;
        } else if (!timeRegex.test(AvailableTime)) {
            setAvailableTimeError("Invalid Time Format. Use hh:mm AM/PM.");
            return;
        } else {
            setAvailableTimeError("");
        }
        

        // If all fields are valid, proceed with sending data
        const newMaintenance = {
            FlatID,
            ResidentName,
            phone,
            MaintenanceType,
            description,
            AvailableTime,
        };

        axios
            .post("http://localhost:8070/Maintenance/add", newMaintenance)
            .then(() => {
                alert("Maintenance Request Added");
                clearForm();
            })
            .catch((err) => {
                alert(err);
            });
    };

    return (
        <div className="body1">
        <div className="Maintenance-form-container-m">
            <div className="form-header-m">
                <h1>Maintenance Service</h1>
            </div>
            <br/>
            <div className="form-container-m">
                <form onSubmit={sendData} className="form">
                    <div className="form-row-m">
                        <div className="form-column1-m">
                            <label htmlFor="flatID" className="form-label-m">
                                Flat ID
                            </label>
                            <input
                                type="text"
                                className="form-input-m flat-id"
                                id="flatID"
                                value={FlatID}
                                onChange={(e) => setFlatID(e.target.value)}
                            />
                            <div className="error-message-m">{FlatIDError}</div>
                        </div>
                        <div className="form-column1-m">
                            <label htmlFor="inputType" className="form-label-m">
                                Maintenance Type
                            </label>
                            <select
                                id="inputType"
                                className="form-input-m maintenance-type"
                                value={MaintenanceType}
                                onChange={(e) => setMaintenanceType(e.target.value)}
                            >
                                <option>none</option>
                                <option>Electricity</option>
                                <option>Waterline</option>
                                <option>Elevator</option>
                                <option>Mechanical</option>
                            </select>
                            <div className="error-message-m">{MaintenanceTypeError}</div>
                        </div>
                    </div>

                    <div className="form-column-m">
                        <label htmlFor="ResidentName" className="form-label-m">
                            Resident Name
                        </label>
                        <input
                            type="text"
                            className="form-input-m resident-name"
                            id="ResidentName"
                            value={ResidentName}
                            onChange={(e) => setResidentName(e.target.value)}
                        />
                        <div className="error-message-m">{ResidentNameError}</div>
                    </div>

                    <div className="form-column-m">
                        <label htmlFor="Phone" className="form-label-m">
                            Phone
                        </label>
                        <input
                            type="text"
                            className="form-input-m phone"
                            id="Phone"
                            value={phone}
                            onChange={(e) => setphone(e.target.value)}
                        />
                        <div className="error-message-m">{phoneError}</div>
                    </div>

                    <div className="form-column-m">
                        <label htmlFor="inputDescription" className="form-label-m">
                            Description
                        </label>
                        <textarea
                            className="form-input-m description"
                            id="inputDescription"
                            value={description}
                            onChange={(e) => setdescription(e.target.value)}
                        />
                        <div className="error-message-m">{descriptionError}</div>
                    </div>

                    <div className="form-column-m">
                        <label htmlFor="AvailableTime" className="form-label-m">
                            Available Time
                        </label>

                        <input
                            type="text"
                            className="form-input-m available-time"
                            id="AvailableTime"
                            value={AvailableTime}
                            onChange={(e) => setAvailableTime(e.target.value)}
                        />
                        <div className="error-message-m">{AvailableTimeError}</div>
                    </div>

                    <div className="form-column-m">
                        <button type="submit" className="form-button-m">
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
       
    );
}

export default MaintenanceForm;
