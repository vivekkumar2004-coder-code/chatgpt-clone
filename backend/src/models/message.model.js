const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId, // store the _id of a User
    ref: "user",//tell mongoose it's referencing the User collection
  },
  chat:{
   type: mongoose.Schema.Types.ObjectId, // store the _id of a User
   ref: "chat",//tell mongoose it's referencing the User collection
  },
  content:{
    type: String,
    required: true
  },
  role:{
    type: String,
    enum:["user","model","system"], //role ki value inme se hi hona chahiye
    default:"user",
    
  }

},{
  timestamps:true
})

const messageModel = mongoose.model("message",messageSchema)
module.exports = messageModel