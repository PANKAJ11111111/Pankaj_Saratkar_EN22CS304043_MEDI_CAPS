const express = require("express");
const path = require("path");
const { readJSON, writeJSON } = require("../utils/fileHandler");
const authenticate = require("../middleware/auth.middleware");

const router = express.Router();
const FOLLOWS_FILE = path.join(__dirname, "../data/follows.json");


router.post("/:trainerId", authenticate, (req, res) => {
    const userId = req.user.id;
    const trainerId = req.params.trainerId;

    const follows = readJSON(FOLLOWS_FILE);

    if (follows.some(f => f.userId === userId && f.trainerId === trainerId)) {
        return res.status(400).json({ message: "Already following" });
    }

    follows.push({ userId, trainerId });
    writeJSON(FOLLOWS_FILE, follows);

    res.json({ message: "Followed successfully" });
});


router.post("/unfollow/:trainerId", authenticate, (req, res) => {
    const userId = req.user.id;
    const trainerId = req.params.trainerId;

    let follows = readJSON(FOLLOWS_FILE);

    follows = follows.filter(
        f => !(f.userId === userId && f.trainerId === trainerId)
    );

    writeJSON(FOLLOWS_FILE, follows);
    res.json({ message: "Unfollowed successfully" });
});



router.get("/status/:trainerId", authenticate, (req, res) => {
    const follows = readJSON(FOLLOWS_FILE);

    const following = follows.some(
        f => f.userId === req.user.id && f.trainerId === req.params.trainerId
    );

    res.json({ following });
});


router.get("/count/:trainerId", (req, res) => {
    const follows = readJSON(FOLLOWS_FILE);

    const count = follows.filter(
        f => f.trainerId === req.params.trainerId
    ).length;

    res.json({ count });
});

module.exports = router;
