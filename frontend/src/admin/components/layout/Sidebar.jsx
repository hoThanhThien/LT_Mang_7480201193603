import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css"; // nếu bạn có CSS riêng

const Sidebar = () => {
  const location = useLocation();

  // Hàm kiểm tra đường dẫn hiện tại để thêm class active
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Admin</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={isActive("/admin") ? "active" : ""}>
            <Link to="/admin">Dashboard</Link>
          </li>
          <li className={isActive("/admin/users") ? "active" : ""}>
            <Link to="/admin/users">Users</Link>
          </li>
          <li className={isActive("/admin/tours") ? "active" : ""}>
            <Link to="/admin/tours">Tours</Link>
          </li>
          <li className={isActive("/admin/bookings") ? "active" : ""}>
            <Link to="/admin/bookings">Bookings</Link>
          </li>
          <li className={isActive("/admin/guides") ? "active" : ""}>
            <Link to="/admin/guides">Guides</Link>
          </li>
          <li className={isActive("/admin/categories") ? "active" : ""}>
            <Link to="/admin/categories">Categories</Link>
          </li>
          <li className={isActive("/admin/discounts") ? "active" : ""}>
            <Link to="/admin/discounts">Discounts</Link>
          </li>
          <li className={isActive("/admin/payments") ? "active" : ""}>
            <Link to="/admin/payments">Payments</Link>
          </li>
          <li className={isActive("/admin/photos") ? "active" : ""}>
            <Link to="/admin/photos">Photos</Link>
          </li>
          <li className={isActive("/admin/roles") ? "active" : ""}>
            <Link to="/admin/roles">Roles</Link>
          </li>
          <li className={isActive("/admin/tour-guides") ? "active" : ""}>
            <Link to="/admin/tour-guides">Tour Guides</Link>
          </li>
          <li className={isActive("/admin/tour-schedules") ? "active" : ""}>
            <Link to="/admin/tour-schedules">Tour Schedules</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
