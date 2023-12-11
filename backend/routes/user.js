import express from "express";
import { updateUserInfo } from "../controllers/user.js";
import { verifyToken } from "../utils/validateToken.js";

const router = express.Router();

router.post("/update/:id", verifyToken, updateUserInfo);

export default router;
