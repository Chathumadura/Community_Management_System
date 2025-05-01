import React from "react";
import { useNavigate } from "react-router-dom";
import "../Samidi/MaintenanceStyle.css"; 



function Header() {
    const navigate = useNavigate();

    return (
        <div className="body1">
            <p style={{ width:"50%", marginLeft: "28%",marginRight:"20%", marginTop:"1%", color: "rgba(247, 247, 253, 0.98)", fontWeight: "1000" ,fontSize:"30px"}}>
              Maintenance & Complaints Management 
            </p>

            <nav className="navbar-m navbar-expand-lg bg-body-tertiary" >
                <div className="container-fluid-m">
                    <a className="navbar-brand">
                        <b>
                            <h4 style={{ color: "rgba(12, 12, 12, 0.98)",fontSize:"20px"}}>
                             <u>  <b><b>
                             Community <b><span style={{ color: "rgba(227, 227, 239, 0.93)" }}>Management</span></b>
                                </b> </b></u>
                            </h4>
                        </b>
                    </a>
                  
                    <div className="collapse navbar-m-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav" style={{ marginLeft: "1%" }}>
                            <div className="nav-item-m">
                                <button className="nav-btn-m" onClick={() => navigate("/")}>
                                    {" "}
                                    <div className="nav-link_H" aria-current="page" href="#"><b>
                                        Home
                                        </b>
                                    </div>
                                </button>
                            </div>

                            <div className="nav-item-m" style={{ marginLeft: "3%" }}>
                                <button className="nav-btn-m" onClick={() => navigate("/Maintenance")}>
                                    <div className="nav-link_H">
                                   <b>Maintenance Request</b> 
                                    </div>
                                </button>
                            </div>


                            <div className="nav-item-m" style={{ marginLeft: "3%" }}>
                                <button className="nav-btn-m" onClick={() => navigate("/MDetails")}>
                                    <div className="nav-link_H">
                                    <b>All Maintenance</b>
                                    </div>
                                </button>
                            </div>

                            <div className="nav-item-m" style={{ marginLeft: "3%" }}>
                                <button className="nav-btn-m" onClick={() => navigate("/MDetailsAdminSide")}>
                                    {" "}
                                    <div className="nav-link_H">
                                        <b>Maintenance Request for Admin</b>
                                    </div>
                                </button>
                            </div>

                            <div className="nav-item-m" style={{ marginLeft: "3%" }}>
                                <button className="nav-btn-m" onClick={() => navigate("/complaints")}>
                                    {" "}
                                    <div className="nav-link_H" href="complaints">
                                        <b>Complaints</b>
                                    </div>
                                </button>
                            </div>

                            <div className="nav-item-m" style={{ marginLeft: "3%" }}>
                                <button className="nav-btn-m" onClick={() => navigate("/CDetails")}>
                                    {" "}
                                    <div className="nav-link_H" href="complaints">
                                        <b>All Complaints</b>
                                    </div>
                                </button>
                            </div>

                            <div className="nav-item-m" style={{ marginLeft: "3%" }}>
                                <button className="nav-btn-m" onClick={() => navigate("/CDetailsAdminSide")}>
                                    {" "}
                                    <div className="nav-link_H">
                                        <b>Complaints for Admin</b>
                                    </div>
                                </button>
                            </div>

                        </ul>
                    </div>

                
                </div>
            </nav>
        </div>
       


    ); 

}
    
export default Header;
