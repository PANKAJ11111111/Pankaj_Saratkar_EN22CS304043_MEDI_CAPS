const express = require("express");
const fs = require("fs");
const path = require("path");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();


const dataPath = (file) => path.join(__dirname, "../data", file);

const PLANS_FILE = dataPath("plans.json");
const TRAINERS_FILE = dataPath("trainers.json");
const SUBS_FILE = dataPath("subscriptions.json");


function readJSON(file) {
    if (!fs.existsSync(file)) return [];
    const data = fs.readFileSync(file, "utf-8");
    if (!data) return [];
    return JSON.parse(data);
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

router.get("/", (req, res) => {
    const plans = readJSON(PLANS_FILE);
    const trainers = readJSON(TRAINERS_FILE);

    const enrichedPlans = plans.map(plan => {
        const trainer = trainers.find(t => t.id === plan.trainerId);
        return {
            ...plan,
            trainerName: trainer ? trainer.name : "Unknown Trainer"
        };
    });

    res.json(enrichedPlans);
});


router.get("/trainer", authenticate, (req, res) => {
    if (req.user.role !== "trainer") {
        return res.status(403).json({ message: "Access denied" });
    }

    const plans = readJSON(PLANS_FILE);

    const trainerPlans = plans.filter(
        plan => plan.trainerId === req.user.id
    );

    res.json(trainerPlans);
});


router.get("/:id", authenticate, (req, res) => {
    const plans = readJSON(PLANS_FILE);
    const trainers = readJSON(TRAINERS_FILE);
    const subs = readJSON(SUBS_FILE);

    const plan = plans.find(p => p.id === req.params.id);
    if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
    }

    const trainer = trainers.find(t => t.id === plan.trainerId);

    const subscribed = subs.some(
        s => s.userId === req.user.id && s.planId === plan.id
    );

    res.json({
        id: plan.id,
        title: plan.title,
        description: plan.description,
        price: plan.price,
        duration: plan.duration,
        trainerId: plan.trainerId,
        trainerName: trainer ? trainer.name : "Unknown Trainer",
        subscribed
    });
});


router.post("/", authenticate, (req, res) => {
    if (req.user.role !== "trainer") {
        return res.status(403).json({ message: "Access denied" });
    }

    const { title, description, price, duration } = req.body;

    if (!title || !description || !price || !duration) {
        return res.status(400).json({ message: "All fields required" });
    }

    const plans = readJSON(PLANS_FILE);

    const newPlan = {
        id: Date.now().toString(),
        trainerId: req.user.id,
        title,
        description,
        price,
        duration
    };

    plans.push(newPlan);
    writeJSON(PLANS_FILE, plans);

    res.json(newPlan);
});


router.put("/:id", authenticate, (req, res) => {
    if (req.user.role !== "trainer") {
        return res.status(403).json({ message: "Access denied" });
    }

    const plans = readJSON(PLANS_FILE);
    const plan = plans.find(p => p.id === req.params.id);

    if (!plan || plan.trainerId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    const { title, description, price, duration } = req.body;

    if (title) plan.title = title;
    if (description) plan.description = description;
    if (price) plan.price = price;
    if (duration) plan.duration = duration;

    writeJSON(PLANS_FILE, plans);
    res.json(plan);
});


router.delete("/:id", authenticate, (req, res) => {
    if (req.user.role !== "trainer") {
        return res.status(403).json({ message: "Access denied" });
    }

    let plans = readJSON(PLANS_FILE);
    const plan = plans.find(p => p.id === req.params.id);

    if (!plan || plan.trainerId !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
    }

    plans = plans.filter(p => p.id !== req.params.id);
    writeJSON(PLANS_FILE, plans);

    res.json({ message: "Plan deleted successfully" });
});

module.exports = router;
