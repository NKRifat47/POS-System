import express from "express";
import {
  getAdminDashboard,
  getStaffDashboard,
} from "../controllers/dashboardController.js";
import {
  authenticate,
  authorizeAdmin,
  authorizeStaff,
} from "../middleware/auth.js";

const router = express.Router();

// Admin dashboard
router.get("/admin", authenticate, authorizeAdmin, getAdminDashboard);

// Staff dashboard
router.get("/staff", authenticate, authorizeStaff, getStaffDashboard);

export default router;
