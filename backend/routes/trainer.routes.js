const express = require("express");
const path = require("path");
const authenticate = require("../middleware/auth.middleware");
const { readJSON, writeJSON } = require("../utils/fileHandler");

const router = express.Router();


const TRAINERS_FILE = path.join(__dirname, "../data/trainers.json");
const PLANS_FILE = path.join(__dirname, "../data/plans.json");
const FOLLOWS_FILE = path.join(__dirname, "../data/follows.json");


router.get("/", (req, res) => {
    const trainers = readJSON(TRAINERS_FILE);
    res.json(trainers);
});


router.get("/:trainerId", authenticate, (req, res) => {
    const trainers = readJSON(TRAINERS_FILE);
    const plans = readJSON(PLANS_FILE);
    const follows = readJSON(FOLLOWS_FILE);

    const trainer = trainers.find(
        t => t.id === req.params.trainerId
    );

    if (!trainer) {
        return res.status(404).json({ message: "Trainer not found" });
    }

    const trainerPlans = plans.filter(
        p => p.trainerId === trainer.id
    );

    const followers = follows.filter(
        f => f.trainerId === trainer.id
    ).length;

    const following = follows.some(
        f => f.userId === req.user.id && f.trainerId === trainer.id
    );

    res.json({
        id: trainer.id,
        name: trainer.name,
        email: trainer.email,
        plans: trainerPlans,
        followers,
        following
    });
});


router.get("/:trainerId/plans", (req, res) => {
    const plans = readJSON(PLANS_FILE);
    const trainerPlans = plans.filter(
        p => p.trainerId === req.params.trainerId
    );
    res.json(trainerPlans);
});

module.exports = router;
