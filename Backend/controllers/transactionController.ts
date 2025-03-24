import { Request, Response } from "express";
import User from "../models/User";

export const transferFunds = async (req: Request, res: Response): Promise<any> => {
  const { senderEmail, receiverEmail, amount } = req.body;

  try {
    const sender = await User.findOne({ email: senderEmail });
    const receiver = await User.findOne({ email: receiverEmail });

    if (!sender || !receiver) return res.status(404).json({ message: "User not found" });
    if (sender.balance < amount) return res.status(400).json({ message: "Insufficient balance" });

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    res.status(200).json({ message: "Transfer successful" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
