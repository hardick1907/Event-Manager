import bcrypt from "bcrypt";
import {generateToken} from "../lib/utils.js";
import User from "../models/user.model.js";


export const Register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    if (newUser) {
        await newUser.save();
        generateToken(newUser._id, res);
        res.status(201).json({
          name: newUser.name,
          email: newUser.email,
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in register controller: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    generateToken(user._id, res);
    res.json({
      user: {
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Error in Login controller:", error);
    res.status(500).json({ message: 'Internal Server error' });
  } 
}

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json({ message: "Authenticated" });
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};