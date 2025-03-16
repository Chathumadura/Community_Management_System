const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MaintenanceSchema =new Schema({
    FlatID:{
        type: String,
        required:true
    },
    ResidentName:{
        type: String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    MaintenanceType:{
        type:String,
        enum: ["Electricity", "Waterline","Elevator","Mechanical"],
        required:true
    },
    description:{
        type:String,
        required:true
    },

    AvailableTime:{
        type:String,
        required:true
    },
    

})
const Maintenance = mongoose.model("Maintenance",MaintenanceSchema);

module.exports =Maintenance;