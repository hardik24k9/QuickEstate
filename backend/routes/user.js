import express from "express";
import {
  deleteUser,
  getUser,
  getUserListings,
  updateUserInfo,
} from "../controllers/user.js";
import { verifyToken } from "../utils/validateToken.js";

const router = express.Router();

router.post("/update/:id", verifyToken, updateUserInfo);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListings);
router.get("/find/:id", verifyToken, getUser);

export default router;
