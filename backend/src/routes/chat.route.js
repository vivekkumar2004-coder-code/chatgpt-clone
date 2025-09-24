const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const router = express.Router();

const chatController = require("../controllers/chat.controller")

// post/api/chat/
router.post('/',authMiddleware.authUser,chatController.createChat);


module.exports = router