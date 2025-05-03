import React, { useState, useEffect } from "react";
import { FiUsers, FiCalendar, FiDollarSign, FiLogOut } from "react-icons/fi";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../Css/Rasindu/AdminDashboard.css";

export default function AdminDashboard() {
  const [totalMaintenanceRequests, setTotalMaintenanceRequests] = useState(0);
    const navigate = useNavigate();


    const fetchMaintenanceCount = async () => {
      try {
          const response = await axios.get("http://localhost:8070/Maintenance/get");
          setTotalMaintenanceRequests(response.data.length); // set maintenance request count
      } catch (error) {
          console.error("Error fetching maintenance data:", error);
      }
  };

    useEffect(() => {
      
        
    fetchMaintenanceCount();
       
    }, []);

    return (
        <div className="admin-dashboard-containerRa">
            <aside className="admin-sidebarRa">
                <div>
                    <h2 className="sidebar-titleRa">HI, Samidi...</h2>
                    <ul className="sidebar-menuRa">
                        <li>
                            <button className="menu-itemRa" onClick={() => navigate("/")}>
                                Home
                            </button>
                        </li>
                        <li>
                            <button className="menu-itemRa" onClick={() => navigate("/Maintenance")}>
                            Maintenance Request
                            </button>
                        </li>
                        <li>
                            <button className="menu-itemRa" onClick={() => navigate("/MDetails")}>
                            All Maintenance
                            </button>
                        </li>
                        <li>
                            <button className="menu-itemRa" onClick={() => navigate("/complaints")}>
                            Complaints
                            </button>
                        </li>

                        <li>
                            <button className="menu-itemRa" onClick={() => navigate("/CDetails")}>
                            All Complaints
                            </button>
                        </li>
                        <li>
                            <button className="menu-itemRa" onClick={() => navigate("/leave")}>
                            Add Leaving Time
                            </button>
                        </li>


                    </ul>
                </div>
                <button className="logout-buttonRa" onClick={() => navigate("/residentDashbord")}>
                    <FiLogOut /> BACK
                </button>
            </aside>

            <main className="admin-main-contentRa">
                <h1 className="dashboard-headingRa">Dashboard</h1>
                <div className="card-gridRa">
                <div className="dashboard-cardRa">
                  <FiUsers className="icon-blueRa" />
                <h2>Total Maintenance Requests</h2>
                <p className="card-valueRa">{totalMaintenanceRequests}</p>
                </div>

                    
                </div>
            </main>
        </div>
    );
}