// src/client/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ClientLayout from "./components/layout/ClientLayout";

const ClientRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ClientLayout>
            <Home />
          </ClientLayout>
        }
      />
      {/* Bạn có thể thêm các route khác cũng bọc bằng ClientLayout */}
    </Routes>
  );
};

export default ClientRoutes;
