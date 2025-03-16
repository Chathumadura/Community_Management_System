const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ComplaintSchema =new Schema({
    ComplaintID:{
        type: String,
        required:true
    },
    MaintenanceType:{
        type: String,
        required:true
    },
    ComplaintsType:{
        type:String,
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