import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { tourService } from "../services/tourService";

export default function TourDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await tourService.getById(id);
      if (mounted) {
        setTour(data);
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "24px 0" }}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container" style={{ padding: "24px 0" }}>
        <div className="alert alert-warning">Không tìm thấy tour!</div>
        <Link className="btn btn-outline-primary" to="/tours">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "24px 0" }}>
      <div className="row g-4">
        <div className="col-md-7">
          <img
            src={tour.image_url}
            alt={tour.title}
            className="w-100 rounded-3 shadow-sm"
            style={{ maxHeight: 420, objectFit: "cover" }}
          />
        </div>
        <div className="col-md-5">
          <h3>{tour.title}</h3>
          <div className="text-muted mb-2">
            <i className="bi bi-geo-alt-fill text-danger"></i> {tour.location}
          </div>
          <div className="mb-2">
            <span className="badge bg-primary me-2">{tour.duration_days || 0} days</span>
            <span className="text-warning">
              <i className="bi bi-star-fill"></i> {(tour.rating || 4.7).toFixed(1)}
            </span>
          </div>
          <p className="text-muted">{tour.description || tour.short_desc}</p>

          <div className="d-flex align-items-center gap-3 my-3">
            <h4 className="text-primary mb-0">${tour.price}</h4>
            <small className="text-muted">/ người</small>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary rounded-pill"
              onClick={() => nav(`/booking/${tour.id}`)}
            >
              Đặt tour
            </button>
            <Link to="/tours" className="btn btn-outline-secondary rounded-pill">
              ← Quay lại
            </Link>
          </div>
        </div>
      </div>

      {/* Itinerary (giả lập) */}
      <div className="mt-5">
        <h5>Lịch trình nổi bật</h5>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Ngày 1–2: City tour & ẩm thực địa phương</li>
          <li className="list-group-item">Ngày 3–4: Khám phá thiên nhiên / trekking</li>
          <li className="list-group-item">Ngày 5–6: Tham quan, trải nghiệm văn hoá</li>
        </ul>
      </div>
    </div>
  );
}
