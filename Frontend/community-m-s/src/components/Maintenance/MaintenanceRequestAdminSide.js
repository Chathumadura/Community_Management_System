import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Samidi/MaintenanceStyle.css"; 
import { useNavigate } from "react-router-dom";

function MaintenanceRequestAdminSide() {
    const [dataList, setDataList] = useState([]);
    const [staffList, setStaffList] = useState([]);
    const navigate = useNavigate();

    // Fetch data function
    const getFetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8070/Maintenance/get");
            if (response.data.success) {
                setDataList(response.data.Maintenance);
                alert("Maintenance fetched successfully");
            } else {
                alert("Failed To Fetch Maintenance");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed To Fetch Maintenance");
        }
    };
    const getStaffData = async () => {
        try {
            const response = await axios.get("http://localhost:8070/employee");
            if (response.data) {
                setStaffList(response.data); // Use response.data directly
            } else {
                alert("Failed To Fetch Staff");
            }
        } catch (error) {
            console.error("Error fetching staff data:", error);
            alert("Failed To Fetch Staff");
        }
    };
    



    useEffect(() => {
        getFetchData();
        getStaffData();
    }, []);


    useEffect(() => {
        console.log("Staff List:", staffList);
        console.log("Maintenance List:", dataList);
    }, [staffList, dataList]);

  // Admin Side: Handle Accept
const handleAccept = (id) => {
    // Update the status of maintenance to 'Accepted'
    axios.put(`http://localhost:8070/Maintenance/update/${id}`, { status: "Accepted" })
        .then((res) => {
            alert("Maintenance Request Accepted");
            // Update the data to reflect changes
            setDataList(dataList.map((Maintenance) => 
                Maintenance._id === id ? { ...Maintenance, status: "Accepted" } : Maintenance
            ));
        })
        .catch((error) => {
            console.error("Error updating maintenance:", error);
            alert("Failed to accept maintenance");
        });
};

// Admin Side: Handle Delete (Reject)
const handleDelete = (id) => {
    axios.delete(`http://localhost:8070/Maintenance/delete/${id}`).then((res) => {
        alert("Maintenance Request Rejected and Deleted Successfully");
        setDataList(dataList.filter(Maintenance => Maintenance._id !== id));
    }).catch((error) => {
        console.error("Error deleting maintenance:", error);
        alert("Failed to delete maintenance");
    });
};



 // Handle Staff Assignment
 const handleAssignStaff = (maintenanceId, employeeId) => {
    axios.put(`http://localhost:8070/Maintenance/assignStaff/${maintenanceId}`, { assignedStaff: employeeId })
        .then((res) => {
            alert("Staff Assigned Successfully");
            setDataList(dataList.map((Maintenance) =>
                Maintenance._id === maintenanceId ? { ...Maintenance, assignedStaff: employeeId } : Maintenance
            ));
        })
        .catch((error) => {
            console.error("Error assigning staff:", error);
          //  alert("Failed to assign staff");
        });
};

    return (
        <div className="body1">
            <div className="form-header-m">
                <h1><i>All Maintenance Request</i></h1>
            </div>
            <br />
           

            <table className="table">
                <thead>
                    <tr style={{ textAlign: "center" }}>
                        <th scope="col">Flat ID</th>
                        <th scope="col">Resident Name</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Maintenance Type</th>
                        <th scope="col">Description</th>
                        <th scope="col">Available Time</th>
                        <th scope="col">Assign Staff</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {dataList.map((Maintenance) => (
                        <tr key={Maintenance._id}>
                            <td>{Maintenance.FlatID}</td>
                            <td>{Maintenance.ResidentName}</td>
                            <td>{Maintenance.phone}</td>
                            <td>{Maintenance.MaintenanceType}</td>
                            <td>{Maintenance.description}</td>
                            <td>{Maintenance.AvailableTime}</td>
                             
                            <td>
    {Maintenance.assignedStaff ? (
        <span>
            {
                staffList.find(staff => staff._id === Maintenance.assignedStaff)?.name
                || "Staff Assigned"
            }
        </span>
    ) : Maintenance.status === "Pending" ? (
        <div className="select-container">
            <select
                onChange={(e) => handleAssignStaff(Maintenance._id, e.target.value)}
                defaultValue=""
                className="form-select"
            >
                <option value="" disabled>Select Staff</option>
                {staffList.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                        {staff.name} ({staff.jobRole})
                    </option>
                ))}
            </select>
        </div>
    ) : (
        <span style={{ color: "gray" }}>Already accepted</span>
    )}
</td>




                            <td>
                            <div className="button-container">
                                {Maintenance.status === "Accepted" ? (
                                    <span>Request Accepted</span>  // Display "Accepted" if status is accepted
                                ) : (
                                    <>
                                        <button   style={{
                                                background: 'linear-gradient(135deg,rgb(171, 29, 7)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px 20px',
                                                borderRadius: '5px'
                                            }}
                                            type="button"
                                            onClick={() => handleAccept(Maintenance._id)}
                                            className="btnAction1"
                                        >
                                            Accept
                                        </button>
                                        &emsp;
                                        <button   style={{
                                                background: 'linear-gradient(135deg,rgb(25, 220, 15)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px 20px',
                                                borderRadius: '5px'
                                            }}
                                            type="button"
                                            onClick={() => handleDelete(Maintenance._id)}
                                            className="btnAction2"
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <br />
            <br />
        </div>
    );
}

export default MaintenanceRequestAdminSide;
