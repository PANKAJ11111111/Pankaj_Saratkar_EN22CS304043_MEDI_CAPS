const fs = require("fs");
const path = require("path");

function readJSON(filePath) {
    try {
        if (!fs.existsSync(filePath)) return [];
        const data = fs.readFileSync(filePath, "utf8").trim();
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function writeJSON(filePath, data) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}


function readJSON(file) {
    if (!fs.existsSync(file)) return [];
    const data = fs.readFileSync(file, "utf-8");
    return data ? JSON.parse(data) : [];
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}




module.exports = { readJSON, writeJSON };
