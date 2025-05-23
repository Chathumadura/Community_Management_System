import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../Css/Rasindu/editemployee.css";

const EditEmployeePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    role: "",
    hourlyRate: "",
    faceData: "",
    address: "",
    contact: "",
    photo: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:8070/employee/${id}`)
      .then((response) => {
        setEmployee(response.data);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file);
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("name", employee.name);
    formData.append("email", employee.email);
    formData.append("role", employee.role);
    formData.append("hourlyRate", employee.hourlyRate);
    formData.append("address", employee.address);
    formData.append("contact", employee.contact);

    if (selectedFile) {
      formData.append("photo", selectedFile);
    }

    try {
      await axios.put(`http://localhost:8070/employee/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const updatedData = await axios.get(`http://localhost:8070/employee/${id}`);
      setEmployee(updatedData.data);

      alert("Employee details updated successfully!");
      navigate("/employees");
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <div className="editERa">
      <div className="edit_list2ERa">
        <h2 className="head2ERa">Edit Employee</h2>
        <form className="for2ERa" onSubmit={handleSubmit} encType="multipart/form-data">
          <div>
            <label>Name:</label>
            <input className="in2ERa" type="text" name="name" value={employee.name} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input className="in2ERa" type="email" name="email" value={employee.email} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Role:</label>
            <select className="in2ERa" name="role" value={employee.role} onChange={handleInputChange}>
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Security">Security</option>
              <option value="Cleaners">Cleaners</option>
              <option value="Resident services">Resident Services</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
          <div>
            <label>Hourly Rate:</label>
            <input className="in2ERa" type="number" name="hourlyRate" value={employee.hourlyRate} onChange={handleInputChange} />
          </div>
          <div>
            <label>Address:</label>
            <input className="in2ERa" type="text" name="address" value={employee.address} onChange={handleInputChange} />
          </div>
          <div>
            <label>Contact:</label>
            <input className="in2ERa" type="text" name="contact" value={employee.contact} onChange={handleInputChange} />
          </div>
          <div>
            <label>Profile Photo:</label>
            <input type="file" name="photo" accept="image/*" onChange={handleFileChange} />
            {employee.photo && <img src={`http://localhost:8070/uploads/${employee.photo}`} alt="Profile" width="100" />}
          </div>
          <button className="btnsubmit2ERa" type="submit">Update Employee</button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeePage;
