import React, { useState, useEffect } from 'react'

export default function PopularTours() {
  const [tours, setTours] = useState([])

  useEffect(() => {
    setTours([
      {
        id: 1,
        title: 'A good traveler has no fixed plans and is not intent on arriving.',
        location: 'Kuala Lumpur, Malaysia',
        price: 'From $50.00',
        duration: '12 Days',
        rating: 4,
        reviews: 2,
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=740&h=518&q=80'
      },
      {
        id: 2,
        title: 'Ultimate Vietnam Travel Guide for Adventurers',
        location: 'Sapa, Vietnam',
        price: 'From $75.00',
        duration: '8 Days',
        rating: 5,
        reviews: 15,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=740&h=518&q=80'
      },
      {
        id: 3,
        title: 'Hidden Gems in Southeast Asia You Must Visit',
        location: 'Bangkok, Thailand',
        price: 'From $65.00',
        duration: '10 Days',
        rating: 4,
        reviews: 8,
        image: 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?auto=format&fit=crop&w=740&h=518&q=80'
      }
    ])
  }, [])

  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i key={i} className={`bi ${i <= rating ? 'bi-star-fill' : 'bi-star'} text-warning`}></i>
      )
    }
    return stars
  }

  return (
    <section id="tours" className="section popular py-5 bg-white">
      <div className="container">
        
        <div className="text-center mb-5">
          <p className="section-subtitle text-primary mb-2" style={{fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase'}}>
            Featured Tours
          </p>
          <h2 className="section-title display-5 fw-bold mb-3">Most Popular Tours</h2>
        </div>

        <div className="row g-4 justify-content-center">
          {tours.map((tour) => (
            <div key={tour.id} className="col-lg-4 col-md-6 col-sm-12">
              <div className="popular-card card border-0 shadow-lg h-100" style={{
                borderRadius: '20px',
                transition: 'all 0.3s ease',
                overflow: 'hidden'
              }}>
                
                <figure className="card-banner position-relative overflow-hidden m-0">
                  <a href="#" className="d-block">
                    <img 
                      src={tour.image} 
                      className="card-img-top"
                      style={{height: '280px', objectFit: 'cover', transition: 'transform 0.3s ease'}}
                      loading="lazy" 
                      alt={tour.location}
                      onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
                      onMouseOut={e => e.target.style.transform = 'scale(1)'}
                    />
                  </a>

                  <span className="card-badge position-absolute top-0 end-0 m-3 bg-primary text-white px-3 py-2 rounded-pill d-flex align-items-center gap-1 shadow">
                    <i className="bi bi-clock"></i>
                    <time className="small fw-semibold">{tour.duration}</time>
                  </span>
                </figure>

                <div className="card-body p-4">
                  
                  <div className="card-wrapper d-flex justify-content-between align-items-start mb-3">
                    <div className="card-price fw-bold text-primary" style={{fontSize: '1.3rem'}}>
                      {tour.price}
                    </div>

                    <div className="card-rating d-flex align-items-center gap-1">
                      <div className="d-flex">
                        {renderStars(tour.rating)}
                      </div>
                      <span className="text-muted small ms-1">({tour.reviews})</span>
                    </div>
                  </div>

                  <h3 className="card-title mb-3" style={{fontSize: '1.1rem', lineHeight: '1.4'}}>
                    <a href="#" className="text-decoration-none text-dark fw-semibold">
                      {tour.title}
                    </a>
                  </h3>

                  <address className="card-location text-muted d-flex align-items-center gap-2 mb-0">
                    <i className="bi bi-geo-alt-fill text-danger"></i>
                    <span className="small">{tour.location}</span>
                  </address>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
