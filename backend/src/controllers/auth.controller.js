const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//New Token Function
const newToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_KEY);
};
//--------- Registering the User ----------
const register = async (req, res) => {
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send({ message: "Email already exists" });
    user = await User.create(req.body);
    const token = newToken(user);
    return res.status(200).send({ user, token });
  } catch (err) {
    return res.status(500).json({
      status: "Failed",
      message: "Sorry for inconvenience please try later",
    });
  }
};

//--------- Login with the email and password we used while registering --------
const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Please check your email and password" });
    }
    let match = user.checkPassword(req.body.password);
    if (!match) {
      return res
        .status(400)
        .send({ message: "Please check your email and password" });
    }
    const token = newToken(user);
    return res.status(200).send({ user, token });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Sorry fot inconvenience please try again later" });
  }
};

const allUsers = async (req, res) => {
  try {
    const users = await User.find().lean().exec();
    return res.status(200).send(users);
  } catch (err) {
    return res.status(400).send("Something went wrong");
  }
};

module.exports = { register, login, allUsers, newToken };
