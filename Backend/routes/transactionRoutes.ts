import express from "express";
import { createTransaction, completeTransaction, getTransactionHistory } from "../controllers/transactionController";
const router = express.Router();

router.post("/create", createTransaction);
router.put("/complete/:transactionId", completeTransaction);
router.get("/transactionhistory/:id", getTransactionHistory);

export default router;