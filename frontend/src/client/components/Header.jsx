import React, { useState, useEffect } from 'react'

export default function Header() {
  const [navActive, setNavActive] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.header')
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="header position-fixed w-100" style={{
      top: 0,
      zIndex: 1050,
      background: 'rgba(255,255,255,0.98)',
      backdropFilter: 'blur(15px)',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      minHeight: '80px'
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-3">
          
          <div>
            <a href="#home" className="text-decoration-none">
              <h1 className="logo fw-bold text-primary fs-2" style={{ margin: '0 0 2px 0', lineHeight: '1' }}>Tourest</h1>
            </a>
            <p className="tagline text-muted" style={{
              fontSize: '0.65rem',
              lineHeight: '1',
              margin: '0',
              whiteSpace: 'nowrap'
            }}>
              Công ty chuyên cung cấp dịch vụ du lịch chất lượng trọn gói
            </p>
          </div>

          <button 
            className="btn d-lg-none border-0 bg-transparent p-2"
            onClick={() => setNavActive(!navActive)}
          >
            <i className={`bi ${navActive ? 'bi-x' : 'bi-list'}`}></i>
          </button>

          <nav className={`navbar ${navActive ? 'd-flex' : 'd-none'} d-lg-flex`}>
            <ul className="navbar-list d-flex flex-column flex-lg-row gap-3 list-unstyled mb-0">
              <li><a href="#home" className="nav-link text-dark fw-semibold">Home</a></li>
              <li><a href="#about" className="nav-link text-dark fw-semibold">About Us</a></li>
              <li><a href="#tours" className="nav-link text-dark fw-semibold">Tours</a></li>
              <li><a href="#destinations" className="nav-link text-dark fw-semibold">Destinations</a></li>
              <li><a href="#blog" className="nav-link text-dark fw-semibold">Blog</a></li>
              <li><a href="#contact" className="nav-link text-dark fw-semibold">Contact Us</a></li>
            </ul>
            <a href="#" className="btn btn-primary px-4 py-2 rounded-pill fw-semibold ms-lg-3">Booking Now</a>
          </nav>
          
        </div>
      </div>
    </header>
  )
}