import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route, Routes } from 'react-router-dom';


import Login from './components/login.js';
import Signup from './components/signup.js';
import ResidentDashbord from './Page/Kavishka/ResidentDashbord.js';
import ApartmentForm from './Page/Kavishka/ApartmentForm.js';
import VehicleRegisterForm from './Page/Kavishka/VehicleRegisterForm.js';
import Userlist from './Page/Kavishka/Dashboard.js';
import Security from './Page/Kavishka/security.js';
import Demoparking from './Page/Kavishka/demoparking.js';
import LeaveTime from './Page/Kavishka/leavingTime.js';
//import SlotMap from './Page/Kavishka/slotMap.js';

//Rasindu
import EmployeeListPage from './Page/Rasindu/EmployeeListPage.js';
import AdminDashbord from './Page/Rasindu/AdminDashboard.js';
import EditEmployeePage from './Page/Rasindu/EditEmployeePage.js';
import AddEmployee from './Page/Rasindu/AddEmployee.js';
import MainDashboard from './Page/Rasindu/mainDashborad.js';
import EmployeeProfile from './Page/Rasindu/EmployeeProfile.js';
import QRCodePage from "./Page/Rasindu/AttendanceForm.js";
import MonthlySalaryReport from './Page/Rasindu/MonthlySalaryReport.js';
import EmployeeSalaryReport from "./Page/Rasindu/EmployeeSalaryReport.js";

//samidi
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
      <Route path='/residentDashbord' element={<ResidentDashbord />} />
      <Route path='/apartmentForm' element={<ApartmentForm />} />
      <Route path='/vehicleRegisterForm' element={<VehicleRegisterForm />} />
      <Route path='/user' element={<Userlist />} />
      <Route path='/security' element={<Security />} />
      <Route path='/demoparking' element={<Demoparking />} />
      <Route path='/leave' element={<LeaveTime />} />




      <Route path="/employees" element={<EmployeeListPage/>}/>
      <Route path="/empdashboard" element={<AdminDashbord/>}/>
      <Route path="/edit_employee/:id" element={<EditEmployeePage />} />
      <Route path="/empform" element={<AddEmployee/>}/>
      <Route path="/maindashboard" element={<MainDashboard/>}/>
      <Route path="/employeeProfile/:id" element={<EmployeeProfile/>}/>
      <Route path="/attend" element={<QRCodePage/>}/>
      <Route path="/monthlysalaryreport" element={<MonthlySalaryReport />} />
      <Route path="/employee-salary-report/:employeeId" element={<EmployeeSalaryReport />} />


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
