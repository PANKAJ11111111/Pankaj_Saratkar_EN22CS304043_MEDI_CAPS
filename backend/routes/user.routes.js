const express = require("express");
const path = require("path");
const { readJSON } = require("../utils/fileHandler");
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

const PLANS_FILE = path.join(__dirname, "../data/plans.json");
const USERS_FILE = path.join(__dirname, "../data/users.json");
const TRAINERS_FILE = path.join(__dirname, "../data/trainers.json");
const FOLLOWS_FILE = path.join(__dirname, "../data/follows.json");
const SUBS_FILE = path.join(__dirname, "../data/subscriptions.json");


router.get("/feed", authenticate, (req, res) => {
    const userId = req.user.id;

    const plans = readJSON(PLANS_FILE);
    const trainers = readJSON(TRAINERS_FILE);
    const follows = readJSON(FOLLOWS_FILE);
    const subs = readJSON(SUBS_FILE);

    const feedPlans = plans.map(plan => {
        const trainer = trainers.find(t => t.id === plan.trainerId);

        const isFollowing = follows.some(
            f => f.userId === userId && f.trainerId === plan.trainerId
        );

        const isSubscribed = subs.some(
            s => s.userId === userId && s.planId === plan.id
        );

        return {
            ...plan,
            trainerName: trainer ? trainer.name : "Unknown",
            following: isFollowing,
            subscribed: isSubscribed
        };
    });

    res.json(feedPlans);
});

module.exports = router;
