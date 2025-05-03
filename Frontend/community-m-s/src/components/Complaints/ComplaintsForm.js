import React,{useState} from "react";
import axios from "axios";
import "../Samidi/MaintenanceStyle.css"; 


function ComplaintsForm(){
const [MaintenanceType,setMaintenanceType] = useState("");
const [StaffName,setStaffName] = useState("");
const [CDescription,setCDescription] = useState("");

//State variables for validation
const [MaintenanceTypeError, setMaintenanceTypeError] = useState("");
const [StaffNameError, setStaffNameError] = useState("");
const [CDescriptionError, setCDescriptionError] = useState("");


const clearForm = () => {
    setMaintenanceType("");
    setStaffName("");
    setCDescription("");
}



const sendData = (e) => {
    e.preventDefault();

    // Validation checks
    if (!MaintenanceType) {
        setMaintenanceTypeError("Maintenance Type is Required.");
        return;
    } else {
        setMaintenanceTypeError("");
    }

    if (!StaffName) {
        setStaffNameError("Staff Name is Required.");
        return;
    } else {
        setStaffNameError("");
    }

    if (!CDescription.trim()) {
        setCDescriptionError("Complaints Description is Required.");
        return;
    } else {
        setCDescriptionError("");
    }

    // If all fields are valid, proceed with sending data
    const newComplaints = {
        MaintenanceType,
        StaffName,
        CDescription,

    };

    axios
        .post("http://localhost:8070/Complaints/add", newComplaints)
        .then(() => {
            alert("Complaints Added");
            clearForm();
        })
        .catch((err) => {
            alert(err);
        });
};

return (
    <div className="body1">
    <div className="Complaints-form-container-m">
        <div className="form-header-m">
            <h1>Maintenance Complaints</h1>
        </div>
        <br/>   <br/>  <br/>
        <br/>

        <div className="form-container-m">
            <form onSubmit={sendData} className="form">
                <div className="form-row-m">
                    
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
                    <label htmlFor="StaffName" className="form-label-m">
                       Staff Name
                    </label>
                    <input
                        type="text"
                        className="form-input-m staff-name"
                        id="StaffName"
                        value={StaffName}
                        onChange={(e) => setStaffName(e.target.value)}
                    />
                    <div className="error-message-m">{StaffNameError}</div>
                </div>

                <div className="form-column-m">
                    <label htmlFor="inputDescription" className="form-label-m">
                       Complaints Description
                    </label>
                    <textarea
                        className="form-input-m description"
                        id="inputDescription"
                        value={CDescription}
                        onChange={(e) => setCDescription(e.target.value)}
                    />
                    <div className="error-message-m">{CDescriptionError}</div>
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

export default ComplaintsForm;






