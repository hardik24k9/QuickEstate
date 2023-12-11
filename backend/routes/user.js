import express from "express";
import { deleteUser, updateUserInfo } from "../controllers/user.js";
import { verifyToken } from "../utils/validateToken.js";

const router = express.Router();

router.post("/update/:id", verifyToken, updateUserInfo);
router.delete("/delete/:id", verifyToken, deleteUser);

export default router;
