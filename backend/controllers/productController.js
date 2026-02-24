import prisma from "../lib/prisma.js";
import fs from "fs";
import path from "path";

// Get all products (with optional search)
export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;

    let where = {};
    if (search) {
      where = {
        OR: [{ name: { contains: search } }, { barcode: { contains: search } }],
      };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get product by barcode
export const getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.params;

    const product = await prisma.product.findUnique({
      where: { barcode },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new product (Admin only)
export const createProduct = async (req, res) => {
  try {
    console.log("createProduct - req.body:", req.body);
    console.log("createProduct - req.file:", req.file);

    if (!req.body || Object.keys(req.body).length === 0) {
      if (req.file) {
        // If file exists but body is empty, it might be a parsing issue
        return res.status(400).json({ error: "Product data is missing. Ensure fields are sent before the file in FormData." });
      }
      return res.status(400).json({ error: "Request body is missing or empty." });
    }
    const { name, price, stock, barcode } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res
        .status(400)
        .json({ error: "Name, price, and stock are required" });
    }

    // Check if barcode already exists
    if (barcode) {
      const existingProduct = await prisma.product.findUnique({
        where: { barcode },
      });
      if (existingProduct) {
        return res.status(400).json({ error: "Barcode already exists" });
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: parseFloat(price),
        stock: parseInt(stock),
        barcode: barcode || null,
        image: req.file ? `/uploads/${req.file.filename}` : null,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body) {
      return res.status(400).json({ error: "Request body is missing." });
    }
    const { name, price, stock, barcode } = req.body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if barcode already exists for another product
    if (barcode && barcode !== existingProduct.barcode) {
      const barcodeExists = await prisma.product.findUnique({
        where: { barcode },
      });
      if (barcodeExists) {
        return res.status(400).json({ error: "Barcode already exists" });
      }
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        name: name || existingProduct.name,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        stock: stock !== undefined ? parseInt(stock) : existingProduct.stock,
        barcode: barcode !== undefined ? barcode : existingProduct.barcode,
        image: req.file ? `/uploads/${req.file.filename}` : existingProduct.image,
      },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProduct = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete image file if it exists
    if (existingProduct.image) {
      const imagePath = path.join(process.cwd(), existingProduct.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await prisma.product.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("deleteProduct error:", error);
    res.status(500).json({ error: error.message });
  }
};
