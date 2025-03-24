import express from "express";
import { transferFunds } from "../controllers/transactionController";
const router = express.Router();

router.post("/transfer", transferFunds);

export default router;