// src/admin/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./views/Home";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default AdminRoutes;
