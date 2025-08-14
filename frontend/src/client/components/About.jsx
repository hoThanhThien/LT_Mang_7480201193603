import React from 'react'

export default function About() {
  const aboutItems = [
    {
      icon: 'bi-compass',
      title: 'Tour guide',
      text: 'Professional and experienced tour guides to make your journey memorable and safe.'
    },
    {
      icon: 'bi-briefcase',
      title: 'Friendly price',
      text: 'Competitive pricing with best value packages for all types of travelers and budgets.'
    },
    {
      icon: 'bi-umbrella',
      title: 'Reliable tour',
      text: 'Trusted and reliable tour services with 24/7 customer support and assistance.'
    }
  ]

  return (
    <section id="about" className="section about py-5 bg-light">
      <div className="container">
        
        <div className="row align-items-center">
          
          <div className="col-lg-6 mb-5 mb-lg-0 order-2 order-lg-1">
            <div className="about-content">
              
              <p className="section-subtitle text-primary mb-2" style={{fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase'}}>
                About Us
              </p>

              <h2 className="section-title display-5 fw-bold mb-4">
                Explore all tour of the world with us.
              </h2>

              <p className="about-text lead mb-5 text-muted">
                Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or
                randomised words which don't look even slightly believable.
              </p>

              <ul className="about-list list-unstyled">
                {aboutItems.map((item, index) => (
                  <li key={index} className="about-item d-flex mb-4">
                    
                    <div className="about-item-icon flex-shrink-0 me-4">
                      <div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle" style={{width: '60px', height: '60px'}}>
                        <i className={item.icon} style={{fontSize: '1.5rem'}}></i>
                      </div>
                    </div>

                    <div className="about-item-content">
                      <h3 className="about-item-title h5 fw-bold mb-2">
                        {item.title}
                      </h3>
                      <p className="about-item-text text-muted mb-0">
                        {item.text}
                      </p>
                    </div>

                  </li>
                ))}
              </ul>

              <a href="#" className="btn btn-primary btn-lg px-4 py-3 rounded-pill">
                Booking Now
              </a>

            </div>
          </div>

          <div className="col-lg-6 order-1 order-lg-2">
            <figure className="about-banner text-center">
              <img 
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=756&h=842&q=80" 
                width="756" 
                height="842" 
                loading="lazy" 
                alt="About Us" 
                className="img-fluid rounded-4 shadow-lg"
              />
            </figure>
          </div>

        </div>

      </div>
    </section>
  )
}
