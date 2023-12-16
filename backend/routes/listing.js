import express from "express";
import {
  createListing,
  deleteListing,
  getListing,
  getListings,
  updateListing,
} from "../controllers/listing.js";
import { verifyToken } from "../utils/validateToken.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/find/:id", getListing);
router.get("/search", getListings);

export default router;
