// seedAdmin.js
const db = require("./db");
const bcrypt = require("bcrypt");

async function seed() {
  try {
    const adminPass = "12345"; // change if you want
    const hash = await bcrypt.hash(adminPass, 8);

    // only insert if not exists
    const [rows] = await db.query("SELECT id FROM users WHERE username='admin' OR email='admin@freshfold.com'");
    if (rows.length) {
      console.log("Admin already exists");
      process.exit(0);
    }

    await db.query("INSERT INTO users (name,email,username,password,role) VALUES (?,?,?,?, 'admin')",
      ["Admin", "admin@freshfold.com", "admin1", hash]);

    console.log("Admin user created: username=admin password=" + adminPass);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
