const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", require("./routes/auth.routes"));
app.use("/plans", require("./routes/plan.routes"));
app.use("/subscribe", require("./routes/subscription.routes"));
app.use("/follow", require("./routes/follow.routes"));
app.use("/users", require("./routes/user.routes"));
app.use("/trainers", require("./routes/trainer.routes"));


app.get("/", (req, res) => {
    res.json({ message: "FitPlanHub API running" });
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
