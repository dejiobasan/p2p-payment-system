import express from "express";
import { createTransaction, getUserTransactions, completeTransaction, getTransactionHistory } from "../controllers/transactionController";
import { authMiddleware } from "../middleware/auth";
const router = express.Router();

router.post("/create", createTransaction);
router.put("/complete/:transactionId", completeTransaction);
router.get("/transactionhistory/:id", getTransactionHistory);
router.get("/userTransactions/:userId", authMiddleware, getUserTransactions);

export default router;