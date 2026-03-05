import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database
const db = new Database("comfoot.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'email_guide' or 'product_links'
    value TEXT NOT NULL,
    result_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", database: !!db });
  });

  app.post("/api/emails", (req, res) => {
    const { email } = req.body;
    console.log(`Received email submission: ${email}`);

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    try {
      const stmt = db.prepare("INSERT INTO emails (email) VALUES (?)");
      stmt.run(email);
      res.status(201).json({ message: "Email stored successfully" });
    } catch (error: any) {
      if (error.code === "SQLITE_CONSTRAINT") {
        return res.status(409).json({ error: "Email already registered" });
      }
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/leads", (req, res) => {
    const { type, value, resultId } = req.body;

    if (!type || !value) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const stmt = db.prepare("INSERT INTO leads (type, value, result_id) VALUES (?, ?, ?)");
      stmt.run(type, value, resultId || null);
      res.status(201).json({ message: "Lead stored successfully" });
    } catch (error: any) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin Data Access Routes
  app.get("/api/admin/emails", (req, res) => {
    console.log("Admin request: GET /api/admin/emails");
    try {
      const emails = db.prepare("SELECT * FROM emails ORDER BY created_at DESC").all();
      console.log(`Found ${emails.length} emails`);
      res.json(emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  });

  app.get("/api/admin/leads", (req, res) => {
    console.log("Admin request: GET /api/admin/leads");
    try {
      const leads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
      console.log(`Found ${leads.length} leads`);
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
