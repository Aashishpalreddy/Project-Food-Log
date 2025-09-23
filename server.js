const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.json());

// simple in-memory store
let foodLogs = [];

// Notification setup (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your.email@gmail.com", // replace
    pass: "your-app-password"     // replace with app password
  }
});

// Route to log food
app.post("/log-food", (req, res) => {
  const { name, portion, date } = req.body;
  foodLogs.push({ name, portion, date });

  // Send email notification (basic example)
  const mailOptions = {
    from: "your.email@gmail.com",
    to: "recipient.email@gmail.com",
    subject: "New Food Logged",
    text: `Food: ${name}, Portion: ${portion}, Date: ${date}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Notification sent:", info.response);
    }
  });

  res.json({ message: "Food logged and notification sent!" });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
