const express = require("express");
const cookieparser = require("cookie-parser");
const app = express();
const cors = require("cors");
const path = require("path");


const authRoutes = require("../src/routes/auth.routes");
const chatRoutes = require("../src/routes/chat.route");

//using  middleware
app.use(express.json());
app.use(cookieparser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//  using routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);

app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

module.exports = app;
