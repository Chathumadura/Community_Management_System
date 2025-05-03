const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComplaintSchema =new Schema({
    MaintenanceType:{
        type: String,
        enum : ["Electricity", "Waterline","Elevator","Mechanical"],
        required:true
    },

    StaffName:{
        type:String,
        required:true
    },
    
    CDescription:{
        type:String,
        required:true
    },


    

})
const Complaints = mongoose.model("Complaints",ComplaintSchema);

module.exports =Complaints;