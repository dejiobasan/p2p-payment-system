import { Request, Response } from "express";
import User from "../models/User";
import Transaction from "../models/Transaction";

export const createTransaction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { senderId, receiverId, amount } = req.body;

    if (!senderId || !receiverId || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sender = await User.findById(senderId);
    if (!sender || sender.balance < amount) {
      return res.status(400).json({ message: "Insufficient funds" });
    }
    const transaction = new Transaction({
      senderId,
      receiverId,
      amount,
      status: "pending",
    });

    await transaction.save();

    return res.status(201).json({ message: "Transaction initiated", transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const completeTransaction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { transactionId } = req.params;
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status !== "pending") {
      return res.status(400).json({ message: "Transaction already processed" });
    }

    const sender = await User.findById(transaction.senderId);
    const receiver = await User.findById(transaction.receiverId);

    if (!sender || !receiver) {
      return res.status(400).json({ message: "Invalid sender or receiver" });
    }

    if (sender.balance < transaction.amount) {
      transaction.status = "failed";
      await transaction.save();
      return res.status(400).json({ message: "Insufficient funds", transaction });
    }

    sender.balance -= transaction.amount;
    receiver.balance += transaction.amount;

    await sender.save();
    await receiver.save();

    transaction.status = "completed";
    await transaction.save();

    return res.status(200).json({ message: "Transaction completed", transaction });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getTransactionHistory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const transactions = await Transaction.find({
      $or: [{ senderId: id }, { receiverId: id }],
    })
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .sort({ timestamp: -1 });

    return res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};


