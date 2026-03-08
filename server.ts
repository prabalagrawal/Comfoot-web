import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sql } from "@vercel/postgres";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database Tables
async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS emails (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        type TEXT NOT NULL,
        value TEXT NOT NULL,
        result_id TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("Database tables initialized");
  } catch (error) {
    console.error("Failed to initialize database tables:", error);
  }
}

initDb();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", database: "postgres" });
  });

  app.post("/api/emails", async (req, res) => {
    const { email } = req.body;
    console.log(`Received email submission: ${email}`);

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    try {
      await sql`INSERT INTO emails (email) VALUES (${email})`;
      res.status(201).json({ message: "Email stored successfully" });
    } catch (error: any) {
      if (error.code === "23505") { // Postgres unique violation
        return res.status(409).json({ error: "Email already registered" });
      }
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    const { type, value, resultId } = req.body;

    if (!type || !value) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await sql`
        INSERT INTO leads (type, value, result_id) 
        VALUES (${type}, ${value}, ${resultId || null})
      `;
      res.status(201).json({ message: "Lead stored successfully" });
    } catch (error: any) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin Data Access Routes
  app.get("/api/admin/emails", async (req, res) => {
    console.log("Admin request: GET /api/admin/emails");
    try {
      const { rows } = await sql`SELECT * FROM emails ORDER BY created_at DESC`;
      console.log(`Found ${rows.length} emails`);
      res.json(rows);
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  });

  app.get("/api/admin/leads", async (req, res) => {
    console.log("Admin request: GET /api/admin/leads");
    try {
      const { rows } = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
      console.log(`Found ${rows.length} leads`);
      res.json(rows);
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
