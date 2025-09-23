const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
function initSocketServer(httpserver) {
  const io = new Server(httpserver, {});

  io.use(async (socket, next) => {
    //SOCKET IO KA MIDDLEWARE

    //TOKEN   check krke pata krte h kon user login kr ra h bhejenge to server se but yaha kaise  lenge uske lie cookie install krna hoga

    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies.token) {
      next(new Error("unauthorised:Token not provided"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET_KEY);

      const user = await userModel.findById(decoded.id);

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("unauthorised"));
    }
  });

  io.on("connection", (socket) => {
    //  console.log("user connected", socket.user)
    // console.log("new socket connection",socket.id);

    socket.on("ai-message", async (messagePayload) => {
      /*
      message payload = {
        content:"hello",
        chat:chatId
      }
      */

      console.log(messagePayload);
      await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "user",
      });
       
      // This was all about short term mwmory
      const chatHistory = (await messageModel.find({
        chat: messagePayload.chat,
      }).sort({createdAt:-1}).limit(10).lean()).reverse();
      

      const response = await aiService.generateResponse(chatHistory.map(item=>{
        return{
          role:item.role,
          parts:[{text:item.content}]
        }
      }));

      await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });
      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

module.exports = initSocketServer;
