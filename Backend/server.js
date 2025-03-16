const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const host = 'localhost';
const router = require('./src/routes/Samidi/Maintenance')




require('dotenv').config();
const dotenv = require("dotenv");

const PORT = process.env.PORT || 8070
app.use(cors())
app.use(bodyParser.json())



const uri = process.env.MONGO_URI



const connect = async () => {
    try {
        await mongoose.connect(uri);
        console.log('Connected to mongoDB !!..');
    }
    catch (error) {
        console.log('MongoDB Error: ', error);
    }
};
connect();

//samidi
app.use('/Maintenance',router);

const server = app.listen(PORT, host, () => {

    console.log(`Node server is listening to ${server.address().port}`)

});



const userRouter = require("./src/routes/kavishka/user");
app.use("/user", userRouter);

