const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
  const {
    fullname: { firstName, lastName },
    email,
    password,
  } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email: email });

  if (isUserAlreadyExists) {
    res.status(400).json({ message: "userAlready Exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await userModel.create({
    fullName: { firstName, lastName },
    email,
    password: hashedPassword,
  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
  res.cookie("token", token);
  res.status(201).json({
    message: "user created successfully",
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  const user = await userModel.findOne({
    email,
  });
  if (!user) {
    return res.status(400).json({
      message: "Invalid email or passwword",
    });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({
      message: "Invalid email or passwword",
    });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);

  res.cookie("token", token);

  res.status(200).json({
    message: "user logged in successfully",
    user: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
}

module.exports = {
  registerUser,
  loginUser,
};
