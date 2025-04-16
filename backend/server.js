import express from "express";
import { quotes } from "./quotes.js";
import cors from "cors";


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());

app.get("/", (req, res) => {
  res.json({result:"server is running"});
});

app.get("/api/quote", (req, res) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json(randomQuote);
});

app.post("/api/quote", (req, res) => {
  let bodyString = "";

  console.log("before on");
  req.on("data", (chunk) => {
    bodyString += chunk;
  });
  console.log("after on");


  req.on("end", () => {
    let body;
    try {
      body = JSON.parse(bodyString);
    } catch (error) {
      console.error("Invalid JSON:", bodyString);
      return res.status(400).json({ message: "Invalid JSON" });
    }

    const { quote, author } = body;

    if (!quote || !author) {
      console.error("Missing fields:", body);
      return res.status(400).json({ message: "Quote and author are required." });
    }

    quotes.push({ quote, author });
    console.log("Quote added:", { quote, author });
    res.status(201).json({ message: "Quote added successfully." });
  });

  req.on("error", (err) => {
    console.error("Request error:", err);
    res.status(500).json({ message: "Server error." });
  });
});

app.listen(PORT, () => {
  const host = process.env.HOST || "localhost";
  console.log(`Server is running at http://${host}:${PORT}`);
});

