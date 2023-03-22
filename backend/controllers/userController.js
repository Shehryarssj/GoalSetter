const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please fill in all fields");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("user already exists");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name: name,
    email: email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201);
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
    return;
  }
  res.status(400);
  throw new Error("invalid user data");
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    const checkPass = await bcrypt.compare(password, user.password);
    if (checkPass) {
      res.status(200);
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });

      return;
    }
  }
  res.status(400);
  throw new Error("invalid credentials");
});

const getMe = asyncHandler(async (req, res) => {
  const { id, name, email } = req.user;
  res.status(200).json({ id, name, email });
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
module.exports = {
  registerUser,
  loginUser,
  getMe,
};
