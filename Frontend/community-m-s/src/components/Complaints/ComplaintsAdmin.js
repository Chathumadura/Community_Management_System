import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Samidi/MaintenanceStyle.css"; 
import { useNavigate } from "react-router-dom";



function ComplaintsAdmin() {
    const [dataList, setDataList] = useState([]);
    const navigate = useNavigate();

    const getFetchData = async () => {
        try {
            const response = await axios.get("http://localhost:8070/Complaints/get");
            console.log(response.data);
            if (response.data.success) {
                setDataList(response.data.Complaints);
            } else {
                alert("Failed To Fetch Complaints");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed To Fetch Complaints");
        }
    };

    useEffect(() => {
        getFetchData();
    }, []);


    const handleAccept = (id) => {
        // Update the status of Complaints to 'Accepted'
        axios.put(`http://localhost:8070/Complaints/update/${id}`, { status: "Accepted" })
            .then((res) => {
                alert("Complaints Request Accepted");
                // Update the data to reflect changes
                setDataList(dataList.map((Complaints) => 
                    Complaints._id === id ? { ...Complaints, status: "Accepted" } : Complaints
                ));
            })
            .catch((error) => {
                console.error("Error updating Complaints:", error);
                alert("Failed to accept Complaints");
            });
    };


    const handleDelete = (id) => {
        axios.delete(`http://localhost:8070/Complaints/delete/${id}`).then((res) => {
            alert("Delete Successfully");
            setDataList(dataList.filter(Complaints => Complaints._id !== id));
        }).catch((error) => {
            console.error("Error deleting complaints:", error);
            alert("Failed to delete complaints");
        });
    };

    return (
        <div className="body1">
        <div className="form-header-m">
                <h1><i> Complaints Request</i></h1>
            </div>
            <br />
            <table className="table">
                <thead>
                    <tr style={{ textAlign: "center" }}>
                        <th scope="col">Maintenance Type</th>
                        <th scope="col">Staff Name</th>
                        <th scope="col">Description</th>
                        <th scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {dataList.map((Complaints) => (
                        <tr key={Complaints._id}>
                            <td>{Complaints.MaintenanceType}</td>
                            <td>{Complaints.StaffName}</td>
                            <td>{Complaints.CDescription}</td>
                           
                            <td>
                                {Complaints.status === "Accepted" ? (
                                    <span>Request Accepted</span>  // Display "Accepted" if status is accepted
                                ) : (
                                    <>
                                        <button  style={{
                                                background: 'linear-gradient(135deg,rgb(171, 29, 7)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px 20px',
                                                borderRadius: '5px'
                                            }}
                                            type="button"
                                            onClick={() => handleAccept(Complaints._id)}
                                            className="btnAction1"
                                        >
                                            Accept
                                        </button>
                                       
                                    </>
                                )}
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

export default ComplaintsAdmin;