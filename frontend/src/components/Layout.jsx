import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Layout.css";

function Layout({ children, user, onLogout }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleNavigation = (page) => {
    setCurrentPage(page);
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    onLogout();
  };

  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="logo">
          <h2>POS System</h2>
        </div>

        <div className="user-info">
          {user.profilePicture ? (
            <img
              src={`http://127.0.0.1:5000/${user.profilePicture}`}
              alt="Avatar"
              className="user-avatar-mini"
            />
          ) : (
            <div className="user-avatar-placeholder">
              {user.name?.charAt(0) || user.email?.charAt(0)}
            </div>
          )}
          <div className="user-details">
            <span className="username">{user.name || "User"}</span>
            <span className="role">{user.role}</span>
          </div>
        </div>

        <ul className="nav-links">
          <li>
            <button
              className={currentPage === "dashboard" ? "active" : ""}
              onClick={() => handleNavigation("dashboard")}
            >
              Dashboard
            </button>
          </li>

          <li>
            <button
              className={currentPage === "profile" ? "active" : ""}
              onClick={() => handleNavigation("profile")}
            >
              My Profile
            </button>
          </li>

          {user.role === "ADMIN" && (
            <li>
              <button
                className={currentPage === "products" ? "active" : ""}
                onClick={() => handleNavigation("products")}
              >
                Products
              </button>
            </li>
          )}

          <li>
            <button
              className={currentPage === "pos" ? "active" : ""}
              onClick={() => handleNavigation("pos")}
            >
              POS Billing
            </button>
          </li>
        </ul>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
