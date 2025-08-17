import React, { useEffect, useMemo, useState } from "react";
import { tourService } from "../services/tourService";
import TourCard from "../components/TourCard";

export default function Tours() {
  const [loading, setLoading] = useState(true);
  const [tours, setTours] = useState([]);
  const [q, setQ] = useState("");
  const [min, setMin] = useState("");
  const [max, setMax] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const data = await tourService.getAll();
      if (mounted) {
        setTours(Array.isArray(data) ? data : []);
        setLoading(false);
      }
    })();
    return () => (mounted = false);
  }, []);

  const filtered = useMemo(() => {
    return tours.filter((t) => {
      const matchQ =
        !q ||
        t.title?.toLowerCase().includes(q.toLowerCase()) ||
        t.location?.toLowerCase().includes(q.toLowerCase());
      const price = Number(t.price || 0);
      const matchMin = !min || price >= Number(min);
      const matchMax = !max || price <= Number(max);
      return matchQ && matchMin && matchMax;
    });
  }, [tours, q, min, max]);

  return (
    <div className="container" style={{ padding: "24px 0" }}>
      <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
        <div className="me-auto">
          <h3 className="mb-0">Tours</h3>
          <small className="text-muted">Tìm tour theo từ khoá & khoảng giá</small>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="form-control"
            placeholder="Search title or location…"
            style={{ minWidth: 220 }}
          />
          <input
            value={min}
            onChange={(e) => setMin(e.target.value)}
            className="form-control"
            type="number"
            placeholder="Min $"
            style={{ width: 110 }}
          />
          <input
            value={max}
            onChange={(e) => setMax(e.target.value)}
            className="form-control"
            type="number"
            placeholder="Max $"
            style={{ width: 110 }}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
          <p className="mt-3 text-muted">Đang tải tour…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 text-muted">Không tìm thấy tour phù hợp.</div>
      ) : (
        <div className="row g-4">
          {filtered.map((t) => (
            <div key={t.id} className="col-12 col-sm-6 col-lg-4">
              <TourCard tour={t} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
