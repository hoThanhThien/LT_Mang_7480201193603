import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import GoToTop from "../GoToTop";
import { Outlet } from "react-router-dom";

export default function ClientLayout() { // Xóa { children }
  return (
    <>
      <Header />
      <main style={{ paddingTop: 'var(--header-h)' }}>
        <Outlet /> {/* Chỉ cần Outlet là đủ */}
      </main>
      <Footer />
      <GoToTop />
    </>
  );
}