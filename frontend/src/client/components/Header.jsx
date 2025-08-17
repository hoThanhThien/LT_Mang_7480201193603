import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";

export default function Header() {
  const [navActive, setNavActive] = useState(false);

  useEffect(() => {
  const header = document.querySelector('.header');
  const updateVar = () => {
    if (header) {
      document.documentElement.style
        .setProperty('--header-h', `${header.offsetHeight}px`);
    }
  };
  updateVar();
  const ro = new ResizeObserver(updateVar);
  if (header) ro.observe(header);
  window.addEventListener('resize', updateVar);
  return () => {
    ro.disconnect();
    window.removeEventListener('resize', updateVar);
  };
}, []);


  const closeOnClick = () => setNavActive(false);

  // helper để NavLink có class "active"
  const navClass = ({ isActive }) =>
    "nav-link text-dark fw-semibold px-0 py-2" + (isActive ? " active" : "");

  return (
    <header
      className="header position-fixed w-100"
      style={{
        top: 0,
        zIndex: 1050,
        background: "rgba(255,255,255,0.98)",
        backdropFilter: "blur(15px)",
        borderBottom: "1px solid rgba(0,0,0,0.1)",
        minHeight: "80px",
      }}
    >
      <div className="container">
        {/* Hàng trên cùng */}
        <div className="d-flex justify-content-between align-items-center" style={{ height: 80 }}>
          {/* Logo + tagline */}
          <div className="d-flex flex-column justify-content-center">
            <Link to="/" className="text-decoration-none" onClick={closeOnClick}>
              <h1 className="logo fw-bold text-primary fs-2 mb-0" style={{ lineHeight: 1 }}>
                Tourest
              </h1>
            </Link>
            <p
              className="tagline text-muted mb-0"
              style={{ fontSize: "0.65rem", lineHeight: 1, whiteSpace: "nowrap" }}
            >
              Công ty chuyên cung cấp dịch vụ du lịch chất lượng trọn gói
            </p>
          </div>

          {/* Nút menu mobile */}
          <button
            className="btn d-lg-none border-0 bg-transparent p-2"
            onClick={() => setNavActive(!navActive)}
            aria-label="Toggle navigation"
          >
            <i className={`bi ${navActive ? "bi-x" : "bi-list"}`}></i>
          </button>

          {/* NAV */}
          <nav
            className={`${navActive ? "d-flex" : "d-none"} d-lg-flex align-items-center`}
            style={{ gap: 16 }}
          >
            {/* List link */}
            <ul className="d-flex flex-column flex-lg-row align-items-center gap-3 list-unstyled mb-0">
              <li>
                <NavLink onClick={closeOnClick} to="/" className={navClass}>
                  Home
                </NavLink>
              </li>
              {/* Các anchor này vẫn OK vì nằm trên trang Home */}
              <li>
                <NavLink to="/?scroll=about" className="nav-link text-dark fw-semibold px-0 py-2" onClick={closeOnClick}>
                About Us
                </NavLink>
              </li>
             <li>
  <NavLink to="/?scroll=tours" className="nav-link text-dark fw-semibold px-0 py-2" onClick={closeOnClick}>
    Featured Tours
  </NavLink>
</li>
<li>
  <NavLink to="/?scroll=destinations" className="nav-link text-dark fw-semibold px-0 py-2" onClick={closeOnClick}>
    Destinations
  </NavLink>
</li>
<li>
  <NavLink to="/?scroll=blog" className="nav-link text-dark fw-semibold px-0 py-2" onClick={closeOnClick}>
    Blog
  </NavLink>
</li>
              <li>
                <a href="/contact" className="nav-link text-dark fw-semibold px-0 py-2">
                  Contact Us
                </a>
              </li>
            </ul>

            {/* Nút Booking – luôn căn giữa dọc nhờ align-items-center của nav */}
            <NavLink
              to="/tours"
              onClick={closeOnClick}
              className="btn btn-primary rounded-pill fw-semibold d-flex align-items-center justify-content-center"
              style={{ padding: "10px 18px" }}
            >
              Booking Now
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
}
