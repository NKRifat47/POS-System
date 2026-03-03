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
import multer from "multer";
import path from "path";
import fs from "fs";

// Create uploads directory if it doesn't exist
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const router = express.Router();

// Public routes (authenticated users can view products)
router.get("/", authenticate, getProducts);
router.get("/:id", authenticate, getProductById);
router.get("/barcode/:barcode", authenticate, getProductByBarcode);

// Admin only routes
router.post(
  "/",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  createProduct
);
router.put(
  "/:id",
  authenticate,
  authorizeAdmin,
  upload.single("image"),
  updateProduct
);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
