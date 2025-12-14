const jwt = require("jsonwebtoken");

const SECRET_KEY = "fitplanhub_secret_key";

function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: "2h" });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch {
        return null;
    }
}

module.exports = { generateToken, verifyToken };
