const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/pinecone.service");
const { text } = require("express");
function initSocketServer(httpserver) {
  const io = new Server(httpserver, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type", "Authorization"],
    },
  });

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

      console.log("this is message payload:", messagePayload);
      /*
      const message = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: messagePayload.content,
        role: "user",
      });

      //here for vectors what i have to do is to convert my message to vector and then store it in pinecone database
      //we will use embeddings from gemini
      //memory creation for VEctor database

      // generated vectors from gemini
      const vectors = await aiService.generateVector(messagePayload.content);
      console.log("vvectors generated", vectors);
      */

      const [message, vectors] = await Promise.all([
        messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: messagePayload.content,
          role: "user",
        }),
        aiService.generateVector(messagePayload.content),
        //and create memory
      ]);
      await createMemory({
        vectors,
        messageId: message._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: messagePayload.content,
        },
      });

      //querry the memory of 8271427135  ooptimizing with second 02
      /*
     
      const memory = await queryMemory({
        queryVector: vectors,
        limit:3,
        metadata:{
          user:socket.user._id
        }
      })
          */

      // await createMemory({messageId,vectors,metadata})
      /*
      await createMemory({
        vectors,
        messageId: message._id,
        metadata: {
          chat: messagePayload.chat,
          user:socket.user._id,
          text:messagePayload.content
        },
      })
        */

      // This was all about short term mwmory
      /*
      const chatHistory = (
        await messageModel
          .find({
            chat: messagePayload.chat,
          })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean()
      ).reverse();
 **/
      // togethered them
      const [memory, chatHistory] = await Promise.all([
        queryMemory({
          queryVector: vectors,
          limit: 3,
          metadata: {
            user: socket.user._id,
          },
        }),
        messageModel
          .find({
            chat: messagePayload.chat,
          })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean(),
      ]);

      const stm = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });

      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `

                        these are some previous messages from the chat, use them to generate a response

                        ${memory.map((item) => item.metadata.text).join("\n")}
                        
                        `,
            },
          ],
        },
      ];


      const response = await aiService.generateResponse([...ltm, ...stm]);
      /*
      const responseMessage = await messageModel.create({
        chat: messagePayload.chat,
        user: socket.user._id,
        content: response,
        role: "model",
      });

      //rresponse by ai in vector foerm
      const responseVectors = await aiService.generateVector(response);
*/

      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
      const [responseMessage, responseVectors] = await Promise.all([
        messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: response,
          role: "model",
        }),
        aiService.generateVector(response),
      ]);
      await createMemory({
        vectors: responseVectors,
        messageId: responseMessage._id,
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
      });
    });
  });
}

module.exports = initSocketServer;
