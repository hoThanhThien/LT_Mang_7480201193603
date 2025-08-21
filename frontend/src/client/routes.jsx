// src/client/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientLayout from "./components/layout/ClientLayout";
import Home from "./pages/Home";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import UserProfile from "./pages/UserProfile";
import AuthPage from "./pages/Auth"; // ✅ sửa tên đúng

export default function ClientRoutes() {
  return (
    <Routes>
      {/* Các route có layout */}
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/:id" element={<TourDetail />} />
        <Route path="booking/:id" element={<Booking />} />
        <Route path="contact" element={<Contact />} />
        <Route path="user" element={<UserProfile />} />
      </Route>

      {/* Các route không dùng layout */}
      <Route path="/auth" element={<AuthPage />} />
    </Routes>
  );
}
