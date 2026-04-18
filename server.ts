import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@vercel/postgres";
import nodemailer from "nodemailer";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy initialization for Database Client
let client: any = null;

const getClient = () => {
  if (!client) {
    const connectionString = process.env.POSTGRES_URL;
    if (!connectionString) {
      console.warn("POSTGRES_URL not found. Database features will be disabled.");
      return null;
    }
    client = createClient({ connectionString });
    client.connect().catch((err: any) => console.error("Database connection error:", err));
  }
  return client;
};

// Use a wrapper for sql to maintain compatibility with existing code
const sql = async (strings: TemplateStringsArray, ...values: any[]) => {
  const dbClient = getClient();
  if (!dbClient) {
    console.warn("Database client not initialized. Skipping query.");
    return { rows: [] };
  }
  return dbClient.sql(strings, ...values);
};

// Initialize Database Tables
async function initDb() {
  try {
    console.log("Initializing database tables...");
    // Ensure client is connected before running queries
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
    await sql`
      CREATE TABLE IF NOT EXISTS quiz_results (
        id SERIAL PRIMARY KEY,
        user_id TEXT,
        scores JSONB NOT NULL,
        result_id TEXT NOT NULL,
        result_title TEXT NOT NULL,
        answers JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS journal_entries (
        id SERIAL PRIMARY KEY,
        user_id TEXT,
        date TEXT,
        pain_level INTEGER,
        symptoms TEXT[],
        notes TEXT,
        activity_level TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        user_id TEXT,
        result_id TEXT,
        rating INTEGER,
        comment TEXT,
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

  app.post("/api/journal-entries", async (req, res) => {
    const { userId, date, painLevel, symptoms, notes, activityLevel } = req.body;
    try {
      await sql`
        INSERT INTO journal_entries (user_id, date, pain_level, symptoms, notes, activity_level)
        VALUES (${userId}, ${date}, ${painLevel}, ${symptoms}, ${notes}, ${activityLevel})
      `;
      res.status(201).json({ message: "Journal entry saved" });
    } catch (error) {
      console.error("Error saving journal entry:", error);
      res.status(500).json({ error: "Failed to save journal entry" });
    }
  });

  app.post("/api/quiz-results", async (req, res) => {
    const { userId, scores, resultId, resultTitle, answers } = req.body;

    try {
      await sql`
        INSERT INTO quiz_results (user_id, scores, result_id, result_title, answers)
        VALUES (${userId || null}, ${JSON.stringify(scores)}, ${resultId}, ${resultTitle}, ${JSON.stringify(answers)})
      `;
      res.status(201).json({ message: "Quiz result stored successfully" });
    } catch (error) {
      console.error("Error storing quiz result:", error);
      res.status(500).json({ error: "Failed to store quiz result" });
    }
  });

  app.post("/api/feedback", async (req, res) => {
    const { userId, resultId, rating, comment } = req.body;
    try {
      await sql`
        INSERT INTO feedback (user_id, result_id, rating, comment)
        VALUES (${userId || null}, ${resultId}, ${rating}, ${comment})
      `;
      res.json({ message: "Feedback saved successfully" });
    } catch (error) {
      console.error("Error saving feedback:", error);
      res.status(500).json({ error: "Failed to save feedback" });
    }
  });

  app.post("/api/send-results", async (req, res) => {
    const { email, resultTitle, explanation, tips, products } = req.body;

    if (!email || !resultTitle) {
      return res.status(400).json({ error: "Email and result title are required" });
    }

    // Configure transporter (User needs to provide these in .env)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"Comfoot Analysis" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your Foot Health Analysis: ${resultTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2D241E;">
          <h1 style="color: #FF6321;">Comfoot Analysis</h1>
          <h2>Your Result: ${resultTitle}</h2>
          <p>${explanation}</p>
          <h3>Recommended Tips:</h3>
          <ul>
            ${tips.map((tip: string) => `<li>${tip}</li>`).join("")}
          </ul>
          <h3>Suggested Products:</h3>
          <ul>
            ${products.map((p: any) => `<li><strong>${p.name}</strong>: ${p.description}</li>`).join("")}
          </ul>
          <p style="font-size: 12px; color: #8E8279; margin-top: 40px;">
            This is an automated report. For professional medical advice, please consult a podiatrist.
          </p>
        </div>
      `,
    };

    try {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials not configured. Skipping email send.");
        return res.status(200).json({ message: "Email simulation successful (SMTP not configured)" });
      }
      await transporter.sendMail(mailOptions);
      res.json({ message: "Results sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
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

  // Serve static assets and SPA fallback
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  if (!isProduction) {
    console.log("Starting in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    console.log(`Starting in production mode. Serving static files from: ${distPath}`);
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const port = process.env.PORT || PORT;
  app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
  });
}

startServer();
