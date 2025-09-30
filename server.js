const express = require("express");
const nodemailer = require("nodemailer");
const path = require("path");
const fs = require('fs');

// small CORS middleware so the React dev server (different port) can call the API
function allowCors(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
}

const app = express();
app.use(express.json());

app.use(allowCors);

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

// data persistence files
const dataDir = path.join(__dirname, 'data');
const foodFile = path.join(dataDir, 'food.json');
const symptomFile = path.join(dataDir, 'symptom.json');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(foodFile)) fs.writeFileSync(foodFile, '[]');
if (!fs.existsSync(symptomFile)) fs.writeFileSync(symptomFile, '[]');

function loadData() {
  try {
    foodLogs = JSON.parse(fs.readFileSync(foodFile, 'utf8') || '[]');
  } catch (e) {
    console.error('Failed to load food data, starting empty', e);
    foodLogs = [];
  }
  try {
    symptomLogs = JSON.parse(fs.readFileSync(symptomFile, 'utf8') || '[]');
  } catch (e) {
    console.error('Failed to load symptom data, starting empty', e);
    symptomLogs = [];
  }
}

function saveFood() {
  fs.writeFileSync(foodFile, JSON.stringify(foodLogs, null, 2));
}

function saveSymptom() {
  fs.writeFileSync(symptomFile, JSON.stringify(symptomLogs, null, 2));
}

loadData();

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

  saveFood();
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

  saveSymptom();
  res.status(201).json(entry);
});

app.get("/api/symptom-logs", (req, res) => {
  res.json(symptomLogs);
});

// Delete endpoints
app.delete('/api/food-logs/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = foodLogs.length;
  foodLogs = foodLogs.filter(f => f.id !== id);
  if (foodLogs.length === before) return res.status(404).json({ error: 'Not found' });
  saveFood();
  res.json({ success: true });
});

app.delete('/api/symptom-logs/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = symptomLogs.length;
  symptomLogs = symptomLogs.filter(s => s.id !== id);
  if (symptomLogs.length === before) return res.status(404).json({ error: 'Not found' });
  saveSymptom();
  res.json({ success: true });
});

// start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
