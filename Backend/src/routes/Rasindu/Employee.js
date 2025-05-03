const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Employee = require("../../model/Rasindu/Employee");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    } else {
        cb(new Error('Only PNG, JPEG, and JPG images are allowed'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});

// Add Employee
router.post("/add", upload.single("photo"), async (req, res) => {
    try {
        const { name, address, contact, email, role, hourlyRate } = req.body;

        // Validate required fields
        if (!name || !address || !contact || !email || !role || !hourlyRate) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: "All required fields must be provided." });
        }

        // Check if email already exists
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ error: "Email already exists." });
        }

        // Generate unique EMP ID
        let nextId = 1;
        const lastEmployee = await Employee.findOne().sort({ _id: -1 });
        if (lastEmployee && lastEmployee.employeeId && lastEmployee.employeeId.startsWith("EMP")) {
            const lastIdNumber = parseInt(lastEmployee.employeeId.replace("EMP", ""));
            if (!isNaN(lastIdNumber)) {
                nextId = lastIdNumber + 1;
            }
        }

        const employeeId = `EMP${nextId}`;
        const photo = req.file ? `/uploads/${req.file.filename}` : null;

        const newEmployee = new Employee({
            name,
            address,
            contact,
            email,
            role,
            hourlyRate,
            photo,
            employeeId
        });

        await newEmployee.save();

        // Ensure the photo URL is complete in the response
        const employeeResponse = newEmployee.toObject();
        if (employeeResponse.photo && !employeeResponse.photo.startsWith('http')) {
            employeeResponse.photo = `http://${req.headers.host}${employeeResponse.photo}`;
        }

        res.status(201).json({ 
            message: "Employee added successfully!", 
            employee: employeeResponse 
        });

    } catch (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("Error adding employee:", err);
        res.status(500).json({ 
            error: err.message.includes('allowed') ? 'Only PNG, JPEG, and JPG images are allowed (max 5MB)' : "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
});

// Get All Employees
router.get("/", async (req, res) => {
    try {
        const employees = await Employee.find();
        // Ensure photo URLs are complete in the response
        const employeesWithFullPhotoUrls = employees.map(employee => {
            const employeeObj = employee.toObject();
            if (employeeObj.photo && !employeeObj.photo.startsWith('http')) {
                employeeObj.photo = `http://${req.headers.host}${employeeObj.photo}`;
            }
            return employeeObj;
        });
        res.status(200).json(employeesWithFullPhotoUrls);
    } catch (err) {
        console.error("Error fetching employees:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// Get Employee by ID
router.get("/:id", async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).lean();
        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Ensure photo URL is complete
        if (employee.photo && !employee.photo.startsWith('http')) {
            employee.photo = `${req.protocol}://${req.get('host')}${employee.photo}`;
        }

        res.status(200).json(employee);
    } catch (err) {
        console.error("Error fetching employee:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Update Employee Details
router.put("/update/:id", upload.single("photo"), async (req, res) => {
    try {
        const employeeId = req.params.id;
        const { name, email, role, hourlyRate, address, contact } = req.body;

        // Get current employee data
        const currentEmployee = await Employee.findById(employeeId);
        if (!currentEmployee) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ error: "Employee not found" });
        }

        let updateData = { 
            name, 
            email, 
            role, 
            hourlyRate, 
            address, 
            contact 
        };

        if (req.file) {
            // Delete old photo if it exists
            if (currentEmployee.photo) {
                const oldPhotoPath = path.join(__dirname, '../../', currentEmployee.photo);
                if (fs.existsSync(oldPhotoPath)) {
                    fs.unlinkSync(oldPhotoPath);
                }
            }
            updateData.photo = `/uploads/${req.file.filename}`;
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            employeeId, 
            updateData, 
            { new: true }
        );

        // Ensure photo URL is complete in the response
        const employeeResponse = updatedEmployee.toObject();
        if (employeeResponse.photo && !employeeResponse.photo.startsWith('http')) {
            employeeResponse.photo = `http://${req.headers.host}${employeeResponse.photo}`;
        }

        res.status(200).json({ 
            message: "Employee updated successfully!", 
            employee: employeeResponse 
        });

    } catch (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error("Error updating employee:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// Delete Employee
router.delete("/delete/:id", async (req, res) => {
    try {
        const employeeId = req.params.id;
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ error: "Employee not found" });
        }

        // Delete associated photo if it exists
        if (employee.photo) {
            const photoPath = path.join(__dirname, '../../', employee.photo);
            if (fs.existsSync(photoPath)) {
                fs.unlinkSync(photoPath);
            }
        }

        await Employee.findByIdAndDelete(employeeId);

        res.status(200).json({ 
            message: "Employee deleted successfully!",
            deletedEmployee: employee
        });

    } catch (err) {
        console.error("Error deleting employee:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

module.exports = router;
