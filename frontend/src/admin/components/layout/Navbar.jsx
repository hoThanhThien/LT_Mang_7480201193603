import React from "react";
import "./navbar.css"; // ✅ Import CSS
import { useAuth } from "../../../client/context/AuthContext"; // ✅ đúng path
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/"); // ✅ Sau khi logout chuyển về trang chủ hoặc trang login
  };

  return (
    <div className="admin-navbar">
      <div className="admin-navbar__left">
        <h2>🏢 Admin Panel</h2>
      </div>
      <div className="admin-navbar__right">
        <span className="admin-navbar__user">👤 Xin chào, Admin</span>
        <button className="admin-navbar__logout" onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Navbar;
