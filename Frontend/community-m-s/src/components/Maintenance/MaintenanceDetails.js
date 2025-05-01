import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Samidi/MaintenanceStyle.css"; 
import { useNavigate } from "react-router-dom";



function MaintenanceDetails() {
    const [dataList, setDataList] = useState([]);
    const navigate = useNavigate();

    const getFetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8070/Maintenance/get");
            console.log(response.data);
            if (response.data.success) {
                setDataList(response.data.Maintenance);
            } else {
                alert("Failed To Fetch Maintenance");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed To Fetch Maintenance");
        }
    };

    useEffect(() => {
        getFetchData();
    }, []);

    const handleDelete = (id) => {
        axios.delete(`http://localhost:8070/Maintenance/delete/${id}`).then((res) => {
            alert("Delete Successfully");
            setDataList(dataList.filter(Maintenance => Maintenance._id !== id));
        }).catch((error) => {
            console.error("Error deleting maintenance:", error);
            alert("Failed to delete maintenance");
        });
    };

    return (
        <div className="body1">
       
        <div className="Maintenance-form-container-m">
            <div className="form-header-m">
                <h1><i>My Maintenance Request</i></h1>
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
                        <th scope="col">Status</th>
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
                            <td>{Maintenance.status || "Pending"}</td>
                            <td>
                                {Maintenance.status === "Pending" ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/editMaintenance/${Maintenance._id}`)}
                                            className="btnAction1"
                                        >
                                            Update
                                        </button>&emsp;
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(Maintenance._id)}
                                            className="btnAction2"
                                        >
                                            Delete
                                        </button>
                                    </>
                                ) : (
                                    <span>Action Denied</span>  // Show status if not pending
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <br />
            <br />
        </div>
        </div>
    );
}

export default MaintenanceDetails;