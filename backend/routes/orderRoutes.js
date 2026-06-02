// routes/orderRoutes.js
module.exports = (db) => {
  const router = require("express").Router();

  // ✅ Create Order (Works with your frontend format ✅)
  router.post("/create", async (req, res) => {
    try {
      const { user_id, payment_mode = "COD", pickup_slot = "", items } = req.body;

      if (!user_id || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Invalid order data" });
      }

      // ✅ Calculate total using rate sent from frontend
      let total = 0;
      items.forEach(it => {
        const qty = Number(it.qty) || 0;
       const rate = Number(it.rate) || 0;
       const count = Array.isArray(it.services) ? it.services.length : 1;
       total += qty * rate * count;
      });


      const status = "placed";
      const current_step = 0;
      const payment_status = payment_mode === "COD" ? "collected" : "pending";

      // ✅ Insert into orders table
      const [orderRes] = await db.query(
        "INSERT INTO orders (user_id, total_amount, status, current_step, payment_mode, payment_status, pickup_slot) VALUES (?,?,?,?,?,?,?)",
        [user_id, total, status, current_step, payment_mode, payment_status, pickup_slot]
      );
      const orderId = orderRes.insertId;

      // ✅ Insert each item in order_items table
      const values = items.map(it => [
        orderId,
        it.type,
        it.qty,
        it.services.join(", "),
        it.rate
      ]);

      await db.query(
        "INSERT INTO order_items (order_id, item_type, quantity, services, price_rate) VALUES ?",
        [values]
      );

      res.status(201).json({
        message: "✅ Order Placed Successfully",
        orderId,
        total
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.sqlMessage || "Server error" });
    }
  });

  // ✅ Fetch user's orders
  router.get("/user/:id", async (req, res) => {
    try {
      const [rows] = await db.query(
        "SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC",
        [req.params.id]
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.sqlMessage || "Server error" });
    }
  });

  // ✅ Admin get all orders including customer name
  router.get("/", async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT o.*, u.name AS customer_name
         FROM orders o
         JOIN users u ON o.user_id = u.id
         ORDER BY o.created_at DESC`
      );
      res.json(rows);
    } catch (err) {
      res.status(500).json({ error: err.sqlMessage || "Server error" });
    }
  });

  // ✅ Admin update order tracking status
  router.put("/update-status/:id", async (req, res) => {
    try {
      const { status, step } = req.body;
      if (!status) return res.status(400).json({ error: "Status required" });

      const [rows] = await db.query(
        "UPDATE orders SET status=?, current_step=? WHERE id=?",
        [status, step, req.params.id]
      );

      if (!rows.affectedRows)
        return res.status(404).json({ error: "Order not found" });

      res.json({ message: "Status Updated ✅", status, step });
    } catch (err) {
      res.status(500).json({ error: err.sqlMessage || "Server error" });
    }
  });

  return router;
};
