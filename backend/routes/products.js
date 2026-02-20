import express from "express";
import {
  getProducts,
  getProductById,
  getProductByBarcode,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public routes (authenticated users can view products)
router.get("/", authenticate, getProducts);
router.get("/:id", authenticate, getProductById);
router.get("/barcode/:barcode", authenticate, getProductByBarcode);

// Admin only routes
router.post("/", authenticate, authorizeAdmin, createProduct);
router.put("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
