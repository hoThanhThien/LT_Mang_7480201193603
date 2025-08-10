import React, { useState, useEffect } from 'react'

export default function Destinations() {
  const [destinations, setDestinations] = useState([])

  useEffect(() => {
    setDestinations([
      {
        id: 1,
        name: 'Malé',
        country: 'Maldives',
        image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=1140&h=1100&q=80',
        size: 'w-50'
      },
      {
        id: 2,
        name: 'Bangkok',
        country: 'Thailand',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1140&h=1100&q=80',
        size: 'w-50'
      },
      {
        id: 3,
        name: 'Kuala Lumpur',
        country: 'Malaysia',
        image: 'https://images.unsplash.com/photo-1583417267826-aebc4d1542e1?auto=format&fit=crop&w=1110&h=480&q=80',
        size: ''
      },
      {
        id: 4,
        name: 'Kathmandu',
        country: 'Nepal',
        image: 'https://images.unsplash.com/photo-1576016770956-debb6d4d8e5b?auto=format&fit=crop&w=1110&h=480&q=80',
        size: ''
      },
      {
        id: 5,
        name: 'Jakarta',
        country: 'Indonesia',
        image: 'https://images.unsplash.com/photo-1596392887114-81265c4e4ed2?auto=format&fit=crop&w=1110&h=480&q=80',
        size: ''
      }
    ])
  }, [])

  return (
    <section id="destinations" className="section destination py-5 bg-light">
      <div className="container">
        
        <div className="text-center mb-5">
          <p className="section-subtitle text-primary mb-2" style={{fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase'}}>
            Destinations
          </p>
          <h2 className="section-title display-5 fw-bold mb-3">Choose Your Place</h2>
        </div>

        <div className="row g-4">
          {destinations.slice(0, 2).map((destination) => (
            <div key={destination.id} className="col-md-6">
              <a href="#" className="destination-card card border-0 shadow-lg overflow-hidden h-100 text-decoration-none" style={{
                borderRadius: '20px',
                transition: 'all 0.3s ease'
              }}>
                <figure className="card-banner position-relative overflow-hidden m-0" style={{height: '400px'}}>
                  <img 
                    src={destination.image} 
                    className="img-cover w-100 h-100" 
                    style={{objectFit: 'cover', transition: 'transform 0.3s ease'}}
                    loading="lazy" 
                    alt={`${destination.name}, ${destination.country}`}
                    onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                  />
                  <div className="position-absolute bottom-0 start-0 w-100 p-4" style={{
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'
                  }}>
                    <div className="card-content text-white">
                      <p className="card-subtitle mb-1 opacity-75 small">{destination.name}</p>
                      <h3 className="card-title h4 mb-0 fw-bold">{destination.country}</h3>
                    </div>
                  </div>
                </figure>
              </a>
            </div>
          ))}
          
          {destinations.slice(2).map((destination) => (
            <div key={destination.id} className="col-lg-4 col-md-6">
              <a href="#" className="destination-card card border-0 shadow-lg overflow-hidden h-100 text-decoration-none" style={{
                borderRadius: '20px',
                transition: 'all 0.3s ease'
              }}>
                <figure className="card-banner position-relative overflow-hidden m-0" style={{height: '280px'}}>
                  <img 
                    src={destination.image} 
                    className="img-cover w-100 h-100" 
                    style={{objectFit: 'cover', transition: 'transform 0.3s ease'}}
                    loading="lazy" 
                    alt={`${destination.name}, ${destination.country}`}
                    onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                  />
                  <div className="position-absolute bottom-0 start-0 w-100 p-3" style={{
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'
                  }}>
                    <div className="card-content text-white">
                      <p className="card-subtitle mb-1 opacity-75 small">{destination.name}</p>
                      <h3 className="card-title h6 mb-0 fw-bold">{destination.country}</h3>
                    </div>
                  </div>
                </figure>
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
