const asyncHandler = require("express-async-handler");
const Goals = require("../models/goalModel");
const User = require("../models/userModel");

const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goals.find({ user: req.user.id });
  res.status(200).json(goals);
});

const setGoal = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("please add a text field to the payload");
  }
  const goal = await Goals.create({
    text: req.body.text,
    user: req.user.id,
  });
  res.status(200).json(goal);
});

const updateGoal = asyncHandler(async (req, res) => {
  const goal = await Goals.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("goal not found");
  }
  // const user = await User.findById(req.user.id);
  if (!req.user) {
    res.status(401);
    throw new Error("user not found");
  }
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("user not authorized");
  }
  const updatedGoal = await Goals.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.status(200).json(updatedGoal);
});

const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goals.findById(req.params.id);
  if (!goal) {
    res.status(400);
    throw new Error("goal not found");
  }
  // const user = await User.findById(req.user.id);
  if (!req.user) {
    res.status(401);
    throw new Error("user not found");
  }
  if (goal.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("user not authorized");
  }
  await Goals.findByIdAndDelete(req.params.id);
  res.status(200).json({ id: req.params.id });
});

module.exports = { getGoals, setGoal, updateGoal, deleteGoal };
