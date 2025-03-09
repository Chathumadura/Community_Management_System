const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const host = 'localhost';
//const router = require('../BACKEND/routes/Anjana/router.js')
//const router2 = require('../BACKEND/routes/KK/router.js')



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

/*app.use('/api', router);
app.use('/api', router2);
app.use('/', mainRouter);*/


const server = app.listen(PORT, host, () => {

    console.log(`Node server is listening to ${server.address().port}`)

});


/*const advertisementRouter = require("./routes/Sasindu/Advertisement.js");
app.use("/Advertisement", advertisementRouter);

const stockRouter = require("./routes/Sasindu/Stock.js");
app.use("/Stock", stockRouter);*/


