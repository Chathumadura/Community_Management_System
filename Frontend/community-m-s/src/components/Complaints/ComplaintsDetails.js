import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Samidi/MaintenanceStyle.css"; 
import { useNavigate } from "react-router-dom";



function ComplaintsDetails() {
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
                <h1><i>My Complaints Request</i></h1>
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
                            <div className="button-container">
                                        <button  style={{
                                                background: 'linear-gradient(135deg,rgb(8, 152, 44)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px 20px',
                                                borderRadius: '5px'
                                            }}
                                            type="button"
                                            onClick={() => navigate(`/editComplaints/${Complaints._id}`)}
                                            className="btnAction1"
                                        >
                                            Update
                                        </button>&emsp;
                                        <button  style={{
                                            background: 'linear-gradient(135deg,rgb(218, 30, 17)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '5px'
                                        }}
                                            type="button"
                                            onClick={() => handleDelete(Complaints._id)}
                                            className="btnAction2"
                                        >
                                            Delete
                                        </button>
                                  
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

export default ComplaintsDetails;