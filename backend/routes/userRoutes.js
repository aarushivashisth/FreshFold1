// routes/userRoutes.js
const bcrypt = require("bcrypt");

module.exports = (db) => {
  const router = require("express").Router();

  // Register
  router.post("/register", async (req, res) => {
    try {
      const { name, email, username, password, address = "", phone = "" } = req.body;
      if (!name || !email || !username || !password) return res.status(400).json({ error: "Missing required fields" });

      // check duplicates
      const [eRows] = await db.query("SELECT id FROM users WHERE email=? OR username=?", [email, username]);
      if (eRows.length) return res.status(400).json({ error: "Email or username already registered" });

      const hash = await bcrypt.hash(password, 8);
      await db.query("INSERT INTO users (name,email,username,password,address,phone,role) VALUES (?,?,?,?,?,?, 'customer')",
        [name, email, username, hash, address, phone]);

      res.json({ message: "Registered" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.sqlMessage || "Server error" });
    }
  });

  // Login using username + password
  // Login using username + password
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: "Username and password required" });

    const [rows] = await db.query("SELECT * FROM users WHERE username=?", [username]);
    if (!rows.length) return res.status(400).json({ error: "User not found" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid password" });

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role
    };

    return res.json({ user: safeUser }); // ✅ FIXED

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: err.sqlMessage || "Server error" });
  }
});

  // Get user by id (optional)
  router.get("/:id", async (req, res) => {
    try {
      const [rows] = await db.query("SELECT id,name,email,username,address,phone,role,created_at FROM users WHERE id=?", [req.params.id]);
      if (!rows.length) return res.status(404).json({ error: "User not found" });
      res.json(rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.sqlMessage || "Server error" });
    }
  });

  return router;
};