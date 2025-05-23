import express from "express";
import { register, login, logout, getBalance, addFunds, getUsers } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/addFunds", addFunds);
router.get("/getBalance/:id", getBalance);
router.get("/getUsers", authMiddleware, getUsers);

export default router;