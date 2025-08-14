import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Nội dung bên phải */}
      <div style={{ marginLeft: "220px", padding: "20px", width: "100%" }}>
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default AdminLayout;
