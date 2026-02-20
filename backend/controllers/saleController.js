import prisma from "../lib/prisma.js";

// Create a new sale
export const createSale = async (req, res) => {
  try {
    const { items } = req.body;
    const staffId = req.user.id;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Items are required" });
    }

    // Validate stock and calculate total
    let totalAmount = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        return res
          .status(404)
          .json({ error: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      saleItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Calculate tax (5%)
    const tax = totalAmount * 0.05;
    const grandTotal = totalAmount + tax;

    // Create sale with items in a transaction
    const sale = await prisma.$transaction(async (tx) => {
      // Create the sale
      const newSale = await tx.sale.create({
        data: {
          staffId,
          totalAmount: grandTotal,
        },
      });

      // Create sale items and update stock
      for (const item of saleItems) {
        await tx.saleItem.create({
          data: {
            saleId: newSale.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          },
        });

        // Update product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newSale;
    });

    // Fetch complete sale with items
    const completeSale = await prisma.sale.findUnique({
      where: { id: sale.id },
      include: {
        saleItems: {
          include: {
            product: true,
          },
        },
        staff: {
          select: { id: true, username: true },
        },
      },
    });

    res.status(201).json({
      ...completeSale,
      subtotal: totalAmount,
      tax,
      totalAmount: grandTotal,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sales (Admin only)
export const getSales = async (req, res) => {
  try {
    const { date } = req.query;

    let where = {};

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      where = {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      };
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        staff: {
          select: { id: true, username: true },
        },
        saleItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single sale by ID
export const getSaleById = async (req, res) => {
  try {
    const { id } = req.params;

    const sale = await prisma.sale.findUnique({
      where: { id: parseInt(id) },
      include: {
        staff: {
          select: { id: true, username: true },
        },
        saleItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!sale) {
      return res.status(404).json({ error: "Sale not found" });
    }

    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get sales for today (for staff dashboard)
export const getTodaysSales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      include: {
        staff: {
          select: { id: true, username: true },
        },
        saleItems: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
