import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

//kavishka
import Login from './components/login.js';
import Signup from './components/signup.js';

//Samidi
import Maintenance from './Page/Maintenance/Maintenance.js';
import MaintenanceDetails from './Page/Maintenance/MaintenanceDetails.js';
import MaintenanceRequestAdminSide from './components/Maintenance/MaintenanceRequestAdminSide.js';
import UpdateMaintenance from './Page/Maintenance/UpdateMaintenance.js'
import Complaints from './Page/Complaints/Complaints.js';
import ComplaintsDetails from './Page/Complaints/ComplaintDetails.js';
import UpdateComplaints from './Page/Complaints/UpdateComplaint.js';
import MaintainDashboard from "./Page/MaintainDashboard/MaintainDashboard.js";
import ComplaintsAdmin from "./components/Complaints/ComplaintsAdmin.js";
import AboutUs from "./components/Samidi/AboutUs.js";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />


      <Route path='/signup' element={< Signup />} />
      <Route path='/login' element={<Login />} />


      <Route path='/Maintenance' element={<Maintenance />} />
      <Route path='/MDetails' element={<MaintenanceDetails />} />
      <Route path='/editMaintenance/:itemId' element={<UpdateMaintenance />} />
      <Route path='/MDetailsAdminSide' element={<MaintenanceRequestAdminSide />} />
      <Route path='/Complaints' element={<Complaints />} />
      <Route path='/CDetails' element={<ComplaintsDetails />} />
      <Route path='/editComplaints/:itemId' element={<UpdateComplaints />} />
      <Route path='/ResidentDash' element={<MaintainDashboard />} />
      <Route path='/CDetailsAdminSide' element={<ComplaintsAdmin />} />
      <Route path="/about" element={<AboutUs/>} />
      


     

    </Routes>

  </BrowserRouter>,
  document.getElementById("root")
);
