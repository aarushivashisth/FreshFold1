// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require("path");

const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Test Database Connection on start
(async () => {
  try {
    const conn = await db.getConnection();
    console.log("✅ MySQL Connected!");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
    process.exit(1);
  }
})();


// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ Routes
app.use("/api/users", require("./routes/userRoutes")(db));
app.use("/api/orders", require("./routes/orderRoutes")(db));
app.use("/api/feedback", require("./routes/feedbackRoutes")(db));

// ✅ Fallback
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
