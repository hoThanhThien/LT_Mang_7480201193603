import React, { useState, useEffect } from 'react'

export default function Header() {
  const [navActive, setNavActive] = useState(false)

  useEffect(() => {
    // Header scroll effect
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
    <header className="header position-fixed w-100" data-header style={{
      top: 0,
      zIndex: 1050,
      background: 'rgba(255,255,255,0.98)',
      backdropFilter: 'blur(15px)',
      borderBottom: '1px solid rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
      minHeight: '80px'
    }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-3">
          
          <a href="#home" className="text-decoration-none">
            <h1 className="logo mb-0 fw-bold text-primary fs-2">Tourest</h1>
          </a>

          <button 
            className="btn d-lg-none border-0 bg-transparent p-2 nav-toggle-btn"
            onClick={() => setNavActive(!navActive)}
            aria-label="Toggle Menu"
            style={{fontSize: '1.5rem'}}
          >
            <i className={`bi ${navActive ? 'bi-x' : 'bi-list'}`}></i>
          </button>

          <nav className={`navbar ${navActive ? 'd-flex' : 'd-none'} d-lg-flex flex-column flex-lg-row position-absolute position-lg-static top-100 start-0 w-100 w-lg-auto bg-white bg-lg-transparent p-4 p-lg-0 shadow-lg shadow-lg-none rounded-lg rounded-lg-0`} style={{
            zIndex: 1040
          }}>
            <ul className="navbar-list d-flex flex-column flex-lg-row gap-3 gap-lg-4 align-items-center mb-3 mb-lg-0 list-unstyled">
              <li>
                <a href="#home" className="navbar-link nav-link text-dark fw-semibold">Home</a>
              </li>
              <li>
                <a href="#about" className="navbar-link nav-link text-dark fw-semibold">About Us</a>
              </li>
              <li>
                <a href="#tours" className="navbar-link nav-link text-dark fw-semibold">Tours</a>
              </li>
              <li>
                <a href="#destinations" className="navbar-link nav-link text-dark fw-semibold">Destinations</a>
              </li>
              <li>
                <a href="#blog" className="navbar-link nav-link text-dark fw-semibold">Blog</a>
              </li>
              <li>
                <a href="#contact" className="navbar-link nav-link text-dark fw-semibold">Contact Us</a>
              </li>
            </ul>
            <a href="#" className="btn btn-secondary btn-primary px-4 py-2 rounded-pill fw-semibold">Booking Now</a>
          </nav>
          
        </div>
      </div>
    </header>
  )
}
