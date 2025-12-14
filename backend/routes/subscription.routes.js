const express = require("express");
const path = require("path");
const { readJSON, writeJSON } = require("../utils/fileHandler");
const authenticate = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

const router = express.Router();
const FILE = path.join(__dirname, "../data/subscriptions.json");

router.post("/:planId", authenticate, allowRoles("user"), (req, res) => {
    const subs = readJSON(FILE);
    if (subs.find(s => s.userId === req.user.id && s.planId === req.params.planId)) {
        return res.status(400).json({ message: "Already subscribed" });
    }
    subs.push({ userId: req.user.id, planId: req.params.planId });
    writeJSON(FILE, subs);
    res.json({ message: "Subscribed" });
});






const SUBS_FILE = path.join(__dirname, "../data/subscriptions.json");


router.post("/:planId", authenticate, (req, res) => {
    const userId = req.user.id;
    const planId = req.params.planId;

    const subs = readJSON(SUBS_FILE);

    const exists = subs.find(
        s => s.userId === userId && s.planId === planId
    );

    if (exists) {
        return res.status(400).json({ message: "Already subscribed" });
    }

    subs.push({
        userId,
        planId,
        date: new Date().toISOString()
    });

    writeJSON(SUBS_FILE, subs);
    res.json({ message: "Subscribed successfully" });
});


router.delete("/:planId", authenticate, (req, res) => {
    const userId = req.user.id;
    const planId = req.params.planId;

    let subs = readJSON(SUBS_FILE);

    subs = subs.filter(
        s => !(s.userId === userId && s.planId === planId)
    );

    writeJSON(SUBS_FILE, subs);
    res.json({ message: "Unsubscribed successfully" });
});

module.exports = router;
