const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // ✅ FIX: Import cors
const cookieParser = require('cookie-parser'); // ✅ FIX: Import cookie-parser
const path = require('path');
const dotenv = require('dotenv');
const logger = require('./src/utils/logger');

const app = express();
const host = 'localhost';

// Load environment variables
require('dotenv').config();

const PORT = process.env.PORT || 8070;

// Middleware
app.use(cors()); // ✅ FIXED: cors now defined
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).send('Something broke!');
});

// MongoDB connection
const uri = process.env.MONGO_URI;

const connect = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to mongoDB !!..');
    } catch (error) {
        console.log('MongoDB Error: ', error);
    }
};
connect();

// Start server
const server = app.listen(PORT, host, () => {
    console.log(`Node server is listening to ${server.address().port}`);
});

// Routes

// Kavishka
const userRoutes = require('./src/routes/Kavishka/userRouter');
app.use('/api/users', userRoutes);

const vehicleRoutes = require('./src/routes/Kavishka/vehicleRoutes');
app.use('/api/vehicles', vehicleRoutes);

const apartmentRoutes = require('./src/routes/Kavishka/apartmentRoutes');
app.use('/api/apartments', apartmentRoutes);

const leavingTimeRouters = require('./src/routes/Kavishka/leavingTimeRouters');
app.use('/api/leavetime', leavingTimeRouters);

const parkingRoutes = require('./src/routes/Kavishka/parkingRoutes');
app.use('/api', parkingRoutes);

// Rasindu
const EmployeeRouter = require('./src/routes/Rasindu/Employee');
app.use("/employee", EmployeeRouter);

const AttendanceRouter = require('./src/routes/Rasindu/attendance');
app.use("/attendance", AttendanceRouter);

const salaryRoutes = require("./src/routes/Rasindu/salary");
app.use("/salary", salaryRoutes);
