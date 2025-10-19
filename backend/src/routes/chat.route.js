const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router();

const chatController = require("../controllers/chat.controller")

// post/api/chat/
router.post('/',authMiddleware.authUser,chatController.createChat);

//get api/chat

router.get('/',authMiddleware.authUser,chatController.getChats);


//get api/chat/messages/:chatId
router.get('/messages/:chatId',authMiddleware.authUser,chatController.getMessages);

module.exports = router