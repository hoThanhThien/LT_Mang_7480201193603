// src/client/components/layout/ClientLayout.jsx
import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import GoToTop from "../GoToTop";

const ClientLayout = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <GoToTop />
    </>
  );
};

export default ClientLayout;
