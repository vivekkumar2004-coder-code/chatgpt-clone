const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // store the _id of a User
      ref: "user",//tell mongoose it's referencing the User collection
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    lastActivity:{
      type:Date,
      default:Date.now
    }
  },
  {
    timestamps: true,
  }
);


const chatModel = mongoose.model("chat",chatSchema);
module.exports = chatModel;