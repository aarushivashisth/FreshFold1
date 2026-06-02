// routes/feedbackRoutes.js
module.exports = (db) => {
  const router = require("express").Router();

  router.post("/create", async (req, res) => {
    try {
      const { user_id, order_id = null, message, rating = null } = req.body;
      if (!user_id || !message) return res.status(400).json({ error: "user_id and message required" });

      await db.query("INSERT INTO feedback (user_id, order_id, message, rating) VALUES (?,?,?,?)", [user_id, order_id, message, rating]);
      res.json({ message: "Feedback submitted" });
    } catch (err) {
      res.status(500).json({ error: err.sqlMessage || "Server error" });
    }
  });

  router.get("/all", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT f.*, u.name as user_name FROM feedback f JOIN users u ON f.user_id = u.id ORDER BY f.created_at DESC");
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.sqlMessage || "Server error" });
    }
  });

  return router;
};
