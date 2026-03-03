import { useState, useEffect } from "react";
import { getStaffDashboard } from "../services/api";
import "./Dashboard.css";

function StaffDashboard({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getStaffDashboard();
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
      <h1>Staff Dashboard</h1>
      <p className="welcome">Welcome, {user.username}!</p>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Your Today's Sales</h3>
          <p className="stat-value">{stats?.todaysSales || 0}</p>
          <span className="stat-label">transactions</span>
        </div>

        <div className="stat-card">
          <h3>Your Today's Revenue</h3>
          <p className="stat-value">
            ${(stats?.todaysRevenue || 0).toFixed(2)}
          </p>
          <span className="stat-label">sales</span>
        </div>
      </div>

      <p style={{ marginTop: "2rem", color: "#666" }}>
        Use the POS Billing page to create new sales.
      </p>
    </div>
  );
}

export default StaffDashboard;
