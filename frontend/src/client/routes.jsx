// src/client/routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ClientLayout from "./components/layout/ClientLayout";
import Home from "./pages/Home";
import Tours from "./pages/Tours";           // tạo file rỗng nếu chưa có
import TourDetail from "./pages/TourDetail"; // tạo file rỗng nếu chưa có
import Booking from "./pages/Booking";       // tạo file rỗng nếu chưa có
import Contact from "./pages/Contact";


export default function ClientRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ClientLayout />}>
        <Route index element={<Home />} />
        <Route path="tours" element={<Tours />} />
        <Route path="tours/:id" element={<TourDetail />} />
        <Route path="booking/:id" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />

      </Route>
    </Routes>
  );
}
