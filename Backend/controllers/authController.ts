import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import "dotenv/config";

const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = process.env.saltRounds || 10;

export const register = async (req: Request, res: Response): Promise<any> => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      User: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        balance: newUser.balance,
      },
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.json({
      success: true,
      message: "Login successful",
      User: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance
      },
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const loggedInUserId = (req as any).user.id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "_id name email"
    );
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addFunds = async (req: Request, res: Response): Promise<any> => {
  const { email, amount } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.balance += amount;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Funds added successfully",
      newBalance: {
        id: user._id,
        username: user.username,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getBalance = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      User: 
        {
          email: user.email,
          balance: user.balance,
        },
     });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
