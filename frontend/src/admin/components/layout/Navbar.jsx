import React from "react";
import "./navbar.css"; // ✅ Import file CSS riêng

const Navbar = () => {
  return (
    <div className="admin-navbar">
      <div className="admin-navbar__left">
        <h2>🏢 Admin Panel</h2>
      </div>
      <div className="admin-navbar__right">
        <span className="admin-navbar__user">👤 Xin chào, Admin</span>
        <button className="admin-navbar__logout">Đăng xuất</button>
      </div>
    </div>
  );
};

export default Navbar;
