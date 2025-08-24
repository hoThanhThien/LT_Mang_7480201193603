import React, { useState, useEffect } from "react";
import { api } from "../../../client/services/api";

export default function TourForm({ onSubmit = () => {}, initialData = {}, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    location: "",
    description: "",
    capacity: "",
    price: "",
    start_date: "",
    end_date: "",
    status: "Available",
    category_id: "",
    ...initialData,
  });

  const [showPhotoForm, setShowPhotoForm] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    caption: "",
    image: null,
    upload_date: new Date().toISOString().split("T")[0],
    is_primary: true,
  });

  // Lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/categories");
        setCategories(res.data.items || []);
      } catch (err) {
        console.error("❌ Lỗi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    let tour_id = initialData?.tour_id;

    // Nếu là cập nhật
    if (tour_id) {
      await api.put(`/tours/${tour_id}`, {
        title: form.title,
        location: form.location,
        description: form.description,
        capacity: parseInt(form.capacity),
        price: parseFloat(form.price),
        start_date: form.start_date,
        end_date: form.end_date,
        status: form.status,
        category_id: parseInt(form.category_id),
      });
    } else {
      // Nếu là thêm mới
      const res = await api.post("/tours/", {
        title: form.title,
        location: form.location,
        description: form.description,
        capacity: parseInt(form.capacity),
        price: parseFloat(form.price),
        start_date: form.start_date,
        end_date: form.end_date,
        status: form.status,
        category_id: parseInt(form.category_id),
      });
      tour_id = res.data.tour_id;
      console.log("✅ Tour đã tạo ID:", tour_id);
    }

    // 👉 Nếu có ảnh mới cần upload
    if (showPhotoForm && photoForm.image) {
      const formData = new FormData();
      formData.append("file", photoForm.image);

      const uploadRes = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = uploadRes.data.image_url;
      console.log("📸 Upload ảnh thành công:", imageUrl);

      await api.post(`/photos/tour/${tour_id}`, {
        caption: photoForm.caption || form.title,
        image_url: imageUrl,
        upload_date: photoForm.upload_date,
        is_primary: photoForm.is_primary ? 1 : 0,
      });

      console.log("✅ Đã thêm ảnh vào tour");
    }

    onSubmit(); // Gọi callback để load lại danh sách
  } catch (err) {
    console.error("❌ Lỗi gửi form:", err);
  }
};


  return (
    <form onSubmit={handleSubmit}>
      <h2>{initialData?.tour_id ? "Cập nhật Tour" : "Thêm Tour mới"}</h2>

      {/* Title & Location */}
      <div className="row">
        <div className="col">
          <label>Tiêu đề</label>
          <input type="text" name="title" value={form.title} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col">
          <label>Địa điểm</label>
          <input type="text" name="location" value={form.location} onChange={handleChange} className="form-control" required />
        </div>
      </div>

      {/* Description */}
      <div className="mt-2">
        <label>Mô tả</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="form-control" />
      </div>

      {/* Capacity & Price */}
      <div className="row mt-2">
        <div className="col">
          <label>Số chỗ</label>
          <input type="number" name="capacity" value={form.capacity} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col">
          <label>Giá</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} className="form-control" required />
        </div>
      </div>

      {/* Start & End Date */}
      <div className="row mt-2">
        <div className="col">
          <label>Ngày bắt đầu</label>
          <input type="date" name="start_date" value={form.start_date} onChange={handleChange} className="form-control" required />
        </div>
        <div className="col">
          <label>Ngày kết thúc</label>
          <input type="date" name="end_date" value={form.end_date} onChange={handleChange} className="form-control" required />
        </div>
      </div>

      {/* Status & Category */}
      <div className="row mt-2">
        <div className="col">
          <label>Trạng thái</label>
          <select name="status" value={form.status} onChange={handleChange} className="form-control">
            <option value="Available">Available</option>
            <option value="Full">Full</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div className="col">
          <label>Danh mục</label>
          <select name="category_id" value={form.category_id} onChange={handleChange} className="form-control" required>
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Toggle Photo Input */}
      <div className="mt-3">
        <button type="button" className="btn btn-outline-primary" onClick={() => setShowPhotoForm(!showPhotoForm)}>
          {showPhotoForm ? "Ẩn ảnh" : "➕ Thêm ảnh"}
        </button>
      </div>

      {/* Photo Form */}
      {showPhotoForm && (
        <div className="mt-3 border p-3 rounded bg-light">
          <div className="row">
            <div className="col-md-6">
              <label>Caption</label>
              <input type="text" className="form-control" value={photoForm.caption} onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label>Ngày upload</label>
              <input type="date" className="form-control" value={photoForm.upload_date} onChange={(e) => setPhotoForm({ ...photoForm, upload_date: e.target.value })} />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-md-6">
              <label>Ảnh</label>
              <input type="file" className="form-control" accept="image/*" onChange={(e) => setPhotoForm({ ...photoForm, image: e.target.files[0] })} />
              {photoForm.image && (
                <img src={URL.createObjectURL(photoForm.image)} alt="Preview" className="mt-2" style={{ maxWidth: "200px", borderRadius: "5px" }} />
              )}
            </div>
            <div className="col-md-6">
              <label>Ảnh chính?</label>
              <select className="form-control" value={photoForm.is_primary ? "1" : "0"} onChange={(e) => setPhotoForm({ ...photoForm, is_primary: e.target.value === "1" })}>
                <option value="1">Có</option>
                <option value="0">Không</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="mt-4">
        <button type="submit" className="btn btn-success me-2">Lưu</button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Huỷ</button>
      </div>
    </form>
  );
}
