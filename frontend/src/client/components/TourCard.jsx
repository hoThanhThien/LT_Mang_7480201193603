// src/client/components/TourCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function TourCard({ tour }) {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i key={i} className={`bi ${i <= rating ? 'bi-star-fill' : 'bi-star'} text-warning`}></i>
      );
    }
    return stars;
  };

  return (
    <div className="card border-0 shadow-lg h-100 d-flex flex-column" style={{
      borderRadius: '20px',
      transition: 'all 0.3s ease',
      overflow: 'hidden'
    }}>
      {/* Hình ảnh */}
      <figure className="position-relative overflow-hidden m-0">
        <Link to={`/tours/${tour.id}`} className="d-block">
          <img
            src={tour.image_url}
            className="card-img-top"
            style={{ height: '280px', objectFit: 'cover', transition: 'transform 0.3s ease' }}
            alt={tour.title}
            loading="lazy"
            onMouseOver={e => e.target.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.target.style.transform = 'scale(1)' }
          />
        </Link>

        <span className="position-absolute top-0 end-0 m-3 bg-danger text-white px-3 py-1 rounded-pill d-flex align-items-center gap-1 shadow-sm small">
          <i className="bi bi-clock"></i>
          {tour.duration_days || tour.duration || '0 days'}
        </span>
      </figure>

      {/* Thân card */}
      <div className="card-body d-flex flex-column justify-content-between p-4">
        <div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-primary fw-bold">
              From <span className="text-primary">${tour.price}</span>
            </span>
            <span className="d-flex align-items-center gap-1">
              {renderStars(tour.rating || 4.6)}
            </span>
          </div>

          <h5 className="card-title mb-2" style={{ lineHeight: '1.4' }}>
            <Link to={`/tours/${tour.id}`} className="text-dark text-decoration-none fw-semibold">
              {tour.title}
            </Link>
          </h5>

          <address className="card-location text-muted d-flex align-items-center gap-2 mb-3">
            <i className="bi bi-geo-alt-fill text-danger"></i>
            <span className="small">{tour.location}</span>
          </address>
        </div>

        {/* Nút */}
        <div className="text-end mt-auto">
          <Link
            to={`/tours/${tour.id}`}
            className="btn btn-outline-primary btn-sm rounded-pill"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
}
