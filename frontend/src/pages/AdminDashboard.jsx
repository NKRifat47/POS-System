import { useState, useEffect } from "react";
import { getAdminDashboard } from "../services/api";
import "./Dashboard.css";

function AdminDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getAdminDashboard();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      <p className="welcome">Welcome, {user.username}!</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Today's Sales</h3>
          <p className="stat-value">{stats?.todaysSales || 0}</p>
          <span className="stat-label">transactions</span>
        </div>

        <div className="stat-card">
          <h3>Today's Revenue</h3>
          <p className="stat-value">
            ${(stats?.todaysRevenue || 0).toFixed(2)}
          </p>
          <span className="stat-label">sales</span>
        </div>

        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">${(stats?.totalRevenue || 0).toFixed(2)}</p>
          <span className="stat-label">all time</span>
        </div>

        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-value">{stats?.totalProducts || 0}</p>
          <span className="stat-label">in inventory</span>
        </div>
      </div>

      {stats?.lowStockProducts?.length > 0 && (
        <div className="alert-section">
          <h3>⚠️ Low Stock Alert</h3>
          <div className="alert-list">
            {stats.lowStockProducts.map((product) => (
              <div key={product.id} className="alert-item">
                <span className="product-name">{product.name}</span>
                <span
                  className={`stock ${product.stock === 0 ? "out-of-stock" : "low"}`}
                >
                  {product.stock === 0
                    ? "Out of Stock"
                    : `${product.stock} left`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
