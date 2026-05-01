import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import { initializeApp, cert, getApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));

if (getApps().length === 0) {
  initializeApp({
    projectId: firebaseConfig.projectId,
  });
}

const db = getFirestore();
// Use the specific database ID from config if provided
// const db = getFirestore(undefined, firebaseConfig.firestoreDatabaseId); 
// Note: firebase-admin/firestore's getFirestore doesn't take databaseId in the same way as standard SDK.
// It usually defaults to (default). If a specific one is needed, we'd use settings.

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", database: "firestore" });
  });

  app.post("/api/emails", async (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    try {
      await db.collection("emails").doc(email).set({
        email,
        createdAt: new Date().toISOString()
      }, { merge: true });
      res.status(201).json({ message: "Email stored successfully" });
    } catch (error) {
      console.error("Firestore error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/leads", async (req, res) => {
    const { type, value, resultId } = req.body;
    if (!type || !value) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      await db.collection("leads").add({
        type,
        value,
        resultId: resultId || null,
        createdAt: new Date().toISOString()
      });
      res.status(201).json({ message: "Lead stored successfully" });
    } catch (error) {
      console.error("Firestore error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/journal-entries", async (req, res) => {
    const { userId, date, painLevel, symptoms, notes, activityLevel } = req.body;
    try {
      await db.collection("users").doc(userId).collection("journal").add({
        date,
        painLevel: Number(painLevel),
        symptoms: symptoms || [],
        notes: notes || "",
        activityLevel,
        createdAt: new Date().toISOString()
      });
      res.status(201).json({ message: "Journal entry saved" });
    } catch (error) {
      console.error("Error saving journal entry:", error);
      res.status(500).json({ error: "Failed to save journal entry" });
    }
  });

  app.post("/api/quiz-results", async (req, res) => {
    const { userId, scores, resultId, resultTitle, answers } = req.body;
    try {
      await db.collection("quiz_results").add({
        userId: userId || null,
        scores,
        resultId,
        resultTitle,
        answers: answers || null,
        createdAt: new Date().toISOString()
      });
      res.status(201).json({ message: "Quiz result stored successfully" });
    } catch (error) {
      console.error("Error storing quiz result:", error);
      res.status(500).json({ error: "Failed to store quiz result" });
    }
  });

  app.post("/api/feedback", async (req, res) => {
    const { userId, resultId, rating, comment } = req.body;
    try {
      await db.collection("feedback").add({
        userId: userId || null,
        resultId,
        rating: Number(rating),
        comment: comment || "",
        createdAt: new Date().toISOString()
      });
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
    try {
      const snapshot = await db.collection("emails").orderBy("createdAt", "desc").get();
      const emails = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(emails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      res.status(500).json({ error: "Failed to fetch emails" });
    }
  });

  app.get("/api/admin/leads", async (req, res) => {
    try {
      const snapshot = await db.collection("leads").orderBy("createdAt", "desc").get();
      const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Serve static assets and SPA fallback
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const port = process.env.PORT || PORT;
  app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();

