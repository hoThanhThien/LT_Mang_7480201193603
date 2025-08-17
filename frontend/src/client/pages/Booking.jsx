import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { tourService } from "../services/tourService";
import { bookingService } from "../services/bookingService";

export default function Booking() {
  const { id } = useParams();
  const nav = useNavigate();
  const [tour, setTour] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    people: 1,
    start_date: "",
    note: "",
  });

  useEffect(() => {
    (async () => {
      const t = await tourService.getById(id);
      setTour(t);
    })();
  }, [id]);

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      tour_id: Number(id),
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      people: Number(form.people || 1),
      start_date: form.start_date || null,
      note: form.note,
    };
    const res = await bookingService.create(payload);
    setSaving(false);
    if (res.ok) {
      alert("Đặt tour thành công! (mock nếu backend lỗi)");
      nav(`/tours/${id}`);
    } else {
      alert("Không thể đặt tour lúc này.");
    }
  };

  return (
    <div className="container" style={{ padding: "24px 0", maxWidth: 900 }}>
      <h3 className="mb-3">Đặt tour</h3>
      {tour && (
        <div className="alert alert-light d-flex align-items-center gap-3">
          <img
            src={tour.image_url}
            alt={tour.title}
            style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 6 }}
          />
          <div>
            <div className="fw-semibold">{tour.title}</div>
            <small className="text-muted">{tour.location} • {tour.duration_days || 0} days</small>
          </div>
          <div className="ms-auto fw-bold text-primary">${tour.price}</div>
        </div>
      )}

      <form onSubmit={submit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Họ tên</label>
          <input name="full_name" className="form-control" required onChange={onChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email</label>
          <input name="email" type="email" className="form-control" required onChange={onChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Số điện thoại</label>
          <input name="phone" className="form-control" onChange={onChange} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Số người</label>
          <input name="people" type="number" min="1" className="form-control" defaultValue={1} onChange={onChange} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Ngày khởi hành</label>
          <input name="start_date" type="date" className="form-control" onChange={onChange} />
        </div>
        <div className="col-12">
          <label className="form-label">Ghi chú</label>
          <textarea name="note" rows="3" className="form-control" onChange={onChange} />
        </div>

        <div className="d-flex gap-2">
          <button disabled={saving} className="btn btn-primary rounded-pill">
            {saving ? "Đang đặt..." : "Xác nhận đặt tour"}
          </button>
          <Link to={`/tours/${id}`} className="btn btn-outline-secondary rounded-pill">
            Huỷ
          </Link>
        </div>
      </form>
    </div>
  );
}
