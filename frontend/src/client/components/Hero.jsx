import React from 'react'

export default function Hero() {
  return (
    <section 
      id="home" 
      className="hero-section d-flex align-items-center"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        paddingTop: '100px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Floating Shapes */}
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
        <div className="shape shape-5"></div>
      </div>

      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 text-white">
            <div className="hero-content">
              <p className="section-subtitle mb-3" style={{
                fontSize: '1.1rem', 
                letterSpacing: '3px',
                textTransform: 'uppercase',
                opacity: '0.9',
                fontWeight: '500'
              }}>
                Explore Your Travel
              </p>

              <h1 className="hero-title mb-4" style={{
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: '800',
                lineHeight: '1.1',
                background: 'linear-gradient(45deg, #ffffff, #f8f9fa, #e9ecef)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 30px rgba(255,255,255,0.5)'
              }}>
                Discover the World
              </h1>

              <p className="hero-text mb-5" style={{
                fontSize: '1.3rem', 
                opacity: '0.9',
                lineHeight: '1.6',
                fontWeight: '300'
              }}>
                Your adventure begins here. Explore breathtaking destinations and create unforgettable memories with our expertly crafted travel experiences.
              </p>

              <div className="hero-buttons d-flex flex-column flex-sm-row gap-4">
                <a href="#tours" className="btn-hero btn-primary-glow text-decoration-none">
                  <span>Explore Tours</span>
                  <i className="bi bi-arrow-right ms-2"></i>
                </a>
                <a href="#about" className="btn-hero btn-secondary-glow text-decoration-none">
                  <span>Learn More</span>
                  <i className="bi bi-play-circle ms-2"></i>
                </a>
              </div>
            </div>
          </div>

          <div className="col-lg-6 d-none d-lg-block">
            <div className="hero-banner text-center">
              <img 
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80" 
                alt="Travel Experience" 
                className="img-fluid rounded-4 shadow-lg"
                style={{
                  maxHeight: '500px',
                  width: 'auto',
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))'
                }}
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator position-absolute bottom-0 start-50 translate-middle-x mb-4">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span className="scroll-text text-white small">Scroll Down</span>
        </div>
      </div>
    </section>
  )
}
