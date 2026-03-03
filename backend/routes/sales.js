import express from "express";
import {
  createSale,
  getSales,
  getSaleById,
  getTodaysSales,
} from "../controllers/saleController.js";
import {
  authenticate,
  authorizeAdmin,
  authorizeStaff,
} from "../middleware/auth.js";

const router = express.Router();

// Staff can create sales and view today's sales
router.post("/", authenticate, authorizeStaff, createSale);
router.get("/today", authenticate, authorizeStaff, getTodaysSales);

// Admin can view all sales
router.get("/", authenticate, authorizeAdmin, getSales);
router.get("/:id", authenticate, authorizeAdmin, getSaleById);

export default router;
