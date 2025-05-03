import React,{useState,useEffect} from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../Samidi/MaintenanceStyle.css"; 

function EditComplaintsForm(){
    const {itemId} = useParams();
    const [formData, setFormData] = useState({
        MaintenanceType:"",
        StaffName:"",
        CDescription:"",
    });

const [MaintenanceTypeError, setMaintenanceTypeError] =  useState("");
const [StaffNameError, setStaffNameError] =  useState("");
const [CDescriptionError, setCDescriptionError] =  useState("");


useEffect(() => {
    axios.get(`http://localhost:8070/Complaints/${itemId}`)
    .then((Response) => {
        console.log("Fetched data:", Response.data);
        setFormData({
            MaintenanceType: Response.data.MaintenanceType || "",
            StaffName: Response.data.StaffName  || "",
            CDescription: Response.data.CDescription || "",
        });
    })
    .catch((error) =>{
        console.error("error fetching item details:", error);
    });
},[itemId]);

const handleChange = (e) => {
    setFormData({
        ...formData,
        [e.target.id]: e.target.value,
    });
};

const handleSubmit = (e) => {
    e.preventDefault();

    //validation checks
    if (!formData.MaintenanceType) {
        setMaintenanceTypeError("Maintenance Type is required.");
        return;
    } else {
        setMaintenanceTypeError("");
    }

    if (!formData.StaffName) {
        setStaffNameError("Staff Name is required.");
        return;
    } else {
        setStaffNameError("");
    }

    if (!formData.CDescription) {
        setCDescriptionError("Complaints Description is required.");
        return;
    } else {
        setCDescriptionError("");
    }

    // If all fields are valid, proceed with sending data
    axios.put(`http://localhost:8070/Complaints/update/${itemId}`, formData)
    .then((Response) => {
        console.log(Response.data);
        //handle success
        setFormData({
            MaintenanceType:"",
            StaffName:"",
            CDescription:"",
        });
    })
    .catch((error) => {
        if (error.Response && error.Response.status === 404) {
            console.error("Resource not found:", error);
            //handle 404 error
        } else {
            console.error("Error updating complaints:", error);
            //handle other errors
        }
    });

};

return (
    <div className="body1">
    <div className="Maintenance-form-container-m">
        <div className="form-header-m">
            <h1>Update Complints Details</h1>
        </div>
        <br/><br /> <br/><br />
        
        <div className="form-container-m">
            <form onSubmit={handleSubmit} className="form">
                <div className="form-row-m">
                    <div className="form-column1-m">
                        <label htmlFor="MaintenanceType" className="form-label-m">Maintenance Type</label>
                        <select
                            id="MaintenanceType"
                            className="form-input-m maintenance-type"
                            value={formData.MaintenanceType}
                            onChange={handleChange}
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
                    <label htmlFor="StaffName" className="form-label-m">Staff Name</label>
                    <input
                        type="text"
                        className="form-input-m staff-name"
                        id="StaffName"
                        value={formData.StaffName}
                        onChange={handleChange}
                    />
                    <div className="error-message-m">{StaffNameError}</div>
                </div>

             <br />
 
                <div className="form-column-m">
                    <label htmlFor="CDescription" className="form-label-m">Complaints Description</label>
                    <textarea
                        className="form-input-m description"
                        id="CDescription"
                        value={formData.CDescription}
                        onChange={handleChange}
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
export default EditComplaintsForm;