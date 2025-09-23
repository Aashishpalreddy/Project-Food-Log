const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
app.use(express.json());

// serve static frontend files from project root
// If a React client build exists, serve it from client/dist; otherwise serve project root
const clientDist = path.join(__dirname, 'client', 'dist');
if (require('fs').existsSync(clientDist)) {
  app.use(express.static(clientDist));
} else {
  app.use(express.static(path.join(__dirname)));
}

// simple in-memory stores
let foodLogs = [];
let symptomLogs = [];

// Notification setup (optional) - use environment variables to enable
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

let transporter = null;
if (EMAIL_USER && EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });
} else {
  console.log("Email notifications disabled. Set EMAIL_USER and EMAIL_PASS to enable.");
}

// API: create and fetch food logs
app.post("/api/food-logs", (req, res) => {
  const { name, portion, date } = req.body;
  if (!name || !portion || !date) return res.status(400).json({ error: "Missing fields" });
  const entry = { id: Date.now(), name, portion, date };
  foodLogs.push(entry);

  if (transporter) {
    const mailOptions = {
      from: EMAIL_USER,
      to: EMAIL_USER,
      subject: "New Food Logged",
      text: `Food: ${name}, Portion: ${portion}, Date: ${date}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log("Error sending email:", error);
      else console.log("Notification sent:", info.response);
    });
  }

  res.status(201).json(entry);
});

app.get("/api/food-logs", (req, res) => {
  res.json(foodLogs);
});

// API: create and fetch symptom logs
app.post("/api/symptom-logs", (req, res) => {
  const { type, severity, notes, date } = req.body;
  if (!type || !severity || !date) return res.status(400).json({ error: "Missing fields" });
  const entry = { id: Date.now(), type, severity, notes, date };
  symptomLogs.push(entry);

  if (transporter) {
    const mailOptions = {
      from: EMAIL_USER,
      to: EMAIL_USER,
      subject: "New Symptom Logged",
      text: `Symptom: ${type}, Severity: ${severity}, Date: ${date}, Notes: ${notes}`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log("Error sending email:", error);
      else console.log("Notification sent:", info.response);
    });
  }

  res.status(201).json(entry);
});

app.get("/api/symptom-logs", (req, res) => {
  res.json(symptomLogs);
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
