const router = require("express").Router();
const Maintenance = require("../../models/Samidi/Maintenance.js");

router.route("/add").post((req,res)=> {
    const FlatID = req.body.FlatID;
    const ResidentName = req.body.ResidentName;
    const phone = req.body.phone;
    const MaintenanceType = req.body.MaintenanceType;
    const description = req.body.description;
    const AvailableTime = req.body.AvailableTime;

    const newMaintenance = new Maintenance ({
        FlatID,
        ResidentName,
        phone,
        MaintenanceType,
        description,
        AvailableTime,
        
    });

    newMaintenance.save().then(()=>{
        res.json("Maintenance Added..")
    }).catch((err)=>{
        console.log(err);
    })
});

    router.route("/get").get((req,res)=> {
        Maintenance.find().then((Maintenance)=>{
            res.json({success:true, Maintenance});
        }).catch((err)=> {
            console.log(err)
            res.status(500).json({ success: false, error: "Error fetching maintenance" });
        });

});

router.route("/update/:id").put(async(req,res)=> {
    let maintainId = req.params.id;
    const {FlatID,ResidentName,phone,MaintenanceType,description, AvailableTime} = req.body;
    const updateMaintenance= {
        FlatID,
        ResidentName,
        phone,
        MaintenanceType,
        description,
        AvailableTime,
    }
    const update = await Maintenance.findByIdAndUpdate(maintainId,updateMaintenance).then(()=> {
        res.status(200).send({status:"Maintenance updated.."})
    }).catch((err)=> {
        console.log(err);
        res.status(500).send({status:"Error with updating data..."});
    })
});

router.route("/delete/:id").delete(async (req, res) => {
    try {
        const maintainId = req.params.id;
        await Maintenance.findByIdAndDelete(maintainId);
        res.status(200).json({ status: "Maintenance deleted" });
    } catch (error) {
        console.error("Error deleting maintenaqnce:", error);
        res.status(500).json({ status: "Error deleting maintenance" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const Maintenance = await Maintenance.findById(req.params.id);
        if (!Maintenance) {
            return res.status(404).json({ error: "Maintenance not found" });
        }
        res.json(Maintenance);
    } catch (error) {
        console.error("Error fetching maintenance by ID:", error);
        res.status(500).json({ error: "Error fetching maintenance" });
    }
})

module.exports= router;
