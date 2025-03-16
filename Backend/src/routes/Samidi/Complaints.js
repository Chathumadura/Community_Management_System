const router = require("express").Router();
const Complaints = require("../../models/Samidi/Complaints.js");

router.route("/add").post((req,res)=> {
    const MaintenanceType = req.body.MaintenanceType;
    const StaffName = req.body.StaffName;
    const CDescription = req.body.CDescription;

    const newComplaint = new Complaints ({
        MaintenanceType,
        StaffName,
        CDescription,
        
    });

    newComplaint.save().then(()=>{
        res.json("Complaints Added..")
    }).catch((err)=>{
        console.log(err);
    })
});

    router.route("/get").get((req,res)=> {
        Complaints.find().then((Complaints)=>{
            res.json({success:true, Complaints});
        }).catch((err)=> {
            console.log(err)
            res.status(500).json({ success: false, error: "Error fetching Complaints" });
        });

});

router.route("/update/:id").put(async(req,res)=> {
    let ComplaintID = req.params.id;
    const {MaintenanceType,StaffName,CDescription} = req.body;
    const updateComplaints= {
        MaintenanceType,
        StaffName,
        CDescription,
    }
    const update = await Complaints.findByIdAndUpdate(ComplaintID,updateComplaints).then(()=> {
        res.status(200).send({status:"Complaints updated.."})
    }).catch((err)=> {
        console.log(err);
        res.status(500).send({status:"Error with updating data..."});
    })
});

router.route("/delete/:id").delete(async (req, res) => {
    try {
        const ComplaintID = req.params.id;
        await Complaints.findByIdAndDelete(ComplaintID);
        res.status(200).json({ status: "Complaints deleted" });
    } catch (error) {
        console.error("Error deleting complaints:", error);
        res.status(500).json({ status: "Error deleting complaints" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const Complaints = await Complaints.findById(req.params.id);
        if (!Complaints) {
            return res.status(404).json({ error: "Complaints not found" });
        }
        res.json(Complaints);
    } catch (error) {
        console.error("Error fetching Complaints by ID:", error);
        res.status(500).json({ error: "Error fetching Complaints" });
    }
})

module.exports= router;