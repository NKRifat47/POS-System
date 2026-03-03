import prisma from "../lib/prisma.js";

// Get admin dashboard stats
export const getAdminDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's sales
    const todaysSales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Calculate today's revenue
    const todaysRevenue = todaysSales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0,
    );

    // Count today's transactions
    const todaysTransactionCount = todaysSales.length;

    // Get low stock products (stock <= 10)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 10,
        },
      },
      orderBy: { stock: "asc" },
    });

    // Get total products count
    const totalProducts = await prisma.product.count();

    // Get total sales count
    const totalSalesCount = await prisma.sale.count();

    // Get total revenue all time
    const allSales = await prisma.sale.findMany();
    const totalRevenue = allSales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0,
    );

    res.json({
      todaysSales: todaysTransactionCount,
      todaysRevenue,
      totalRevenue,
      totalProducts,
      totalSalesCount,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get staff dashboard stats
export const getStaffDashboard = async (req, res) => {
  try {
    const staffId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get today's sales by this staff
    const todaysSales = await prisma.sale.findMany({
      where: {
        staffId,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });

    // Calculate today's revenue
    const todaysRevenue = todaysSales.reduce(
      (sum, sale) => sum + sale.totalAmount,
      0,
    );

    // Count today's transactions
    const todaysTransactionCount = todaysSales.length;

    res.json({
      todaysSales: todaysTransactionCount,
      todaysRevenue,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
