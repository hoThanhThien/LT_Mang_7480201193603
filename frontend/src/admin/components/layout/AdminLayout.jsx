import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar"; // ✅ THÊM import này
import { Outlet } from "react-router-dom";
import "./adminLayout.css"; // CSS layout chính

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Nội dung bên phải */}
      <div style={{ marginLeft: "220px", width: "100%" }}>
        {/* ✅ THÊM Navbar tại đây */}
        <Navbar />

        {/* Phần nội dung chính */}
        <div style={{ padding: "20px" }}>
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
