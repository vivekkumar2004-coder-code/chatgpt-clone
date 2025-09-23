const express = require("express");
const cookieparser = require("cookie-parser");
const app = express();
const authRoutes = require("../src/routes/auth.routes");
const chatRoutes = require('../src/routes/chat.route')

//using  middleware
app.use(express.json());
app.use(cookieparser());

//  using routes
app.use("/api/auth", authRoutes);
app.use('/api/chats',chatRoutes)


module.exports = app;
