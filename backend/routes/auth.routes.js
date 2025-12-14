const express = require("express");
const path = require("path");
const bcrypt = require("bcryptjs");
const { readJSON, writeJSON } = require("../utils/fileHandler");
const { generateToken } = require("../utils/token");

const router = express.Router();

const USERS_FILE = path.join(__dirname, "../data/users.json");
const TRAINERS_FILE = path.join(__dirname, "../data/trainers.json");


router.post("/signup", async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields required" });
    }

    const FILE = role === "trainer" ? TRAINERS_FILE : USERS_FILE;
    const records = readJSON(FILE);

    if (records.find(r => r.email === email)) {
        return res.status(400).json({ message: "Account already exists" });
    }

    const newAccount = {
        id: Date.now().toString(),
        name,
        email,
        password: await bcrypt.hash(password, 10)
    };

    records.push(newAccount);
    writeJSON(FILE, records);

    res.json({ message: `${role} registered successfully` });
});


router.post("/login", async (req, res) => {
    const { email, password, role } = req.body;

    const FILE = role === "trainer" ? TRAINERS_FILE : USERS_FILE;
    const records = readJSON(FILE);

    const account = records.find(r => r.email === email);
    if (!account) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, account.password);
    if (!match) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
        id: account.id,
        role
    });

    res.json({
        token,
        role,
        userId: account.id
    });
});

module.exports = router;
