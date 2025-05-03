const router = require("express").Router();
const Maintenance = require("../../model/MaintenanceModel/Maintenance");

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

router.route("/update/:id").put(async (req, res) => {
    let maintainId = req.params.id;
    const { status, FlatID, ResidentName, phone, MaintenanceType, description, AvailableTime } = req.body;

    const updateMaintenance = {
        FlatID,
        ResidentName,
        phone,
        MaintenanceType,
        description,
        AvailableTime,
        status: status || "Pending"  // If no status is provided, keep it as "Pending"
    };

    try {
        const updatedMaintenance = await Maintenance.findByIdAndUpdate(maintainId, updateMaintenance, { new: true });
        res.status(200).send({ status: "Maintenance updated", updatedMaintenance });
    } catch (err) {
        console.log(err);
        res.status(500).send({ status: "Error with updating data..." });
    }
});


router.route("/delete/:id").delete(async (req, res) => {
    try {
        const maintainId = req.params.id;
        const deletedMaintenance = await Maintenance.findByIdAndDelete(maintainId);
        if (!deletedMaintenance) {
            return res.status(404).json({ status: "Maintenance not found" });
        }
        res.status(200).json({ status: "Maintenance deleted" });
    } catch (error) {
        console.error("Error deleting maintenance:", error);
        res.status(500).json({ status: "Error deleting maintenance" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const maintenance = await Maintenance.findById(req.params.id);
        if (!maintenance) {
            return res.status(404).json({ error: "Maintenance not found" });
        }
        res.json(maintenance);
    } catch (error) {
        console.error("Error fetching maintenance by ID:", error);
        res.status(500).json({ error: "Error fetching maintenance" });
    }
})



module.exports= router;
