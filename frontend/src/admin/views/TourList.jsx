// 📁 src/views/TourList.jsx
import React, { useEffect, useState } from 'react';
import { getTours, createTour, updateTour, deleteTour } from '../services/tourService'; // ✅ Đúng tên
import TourTable from '../components/tables/TourTable';
import TourForm from '../components/forms/TourForm';

export default function TourList() {
  const [tours, setTours] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTour, setEditingTour] = useState(null);

  // 📥 Load tour từ API
  const loadData = async () => {
    try {
      const res = await getTours(); // ✅ getTours đúng tên hàm trong tourService
      setTours(res.data.items || []);
    } catch (err) {
      console.error("❌ Lỗi tải tour:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ✅ Thêm/Sửa tour
  const handleFormSubmit = async (formData) => {
    try {
      if (editingTour) {
        await updateTour(editingTour.tour_id, formData);
      } else {
        await createTour(formData);
      }
      await loadData();
      setShowForm(false);
      setEditingTour(null);
    } catch (error) {
      console.error("❌ Lỗi xử lý form:", error);
    }
  };

  // 🗑 Xoá tour
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá tour này không?")) {
      try {
        await deleteTour(id);
        await loadData();
      } catch (err) {
        console.error("❌ Lỗi xoá tour:", err);
      }
    }
  };

  // ✏️ Sửa tour
  const handleEdit = (tour) => {
    setEditingTour(tour);
    setShowForm(true);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Danh sách Tour</h2>

      {showForm ? (
        <TourForm
  initialData={editingTour}
  onSubmit={() => {
    loadData();          // ✅ Reload danh sách sau khi form xử lý xong
    setShowForm(false);  // ✅ Ẩn form
    setEditingTour(null);
/* không cần truyền formData ở đây nữa vì TourForm tự handle API */
  }}
  onCancel={() => {
    setShowForm(false);
    setEditingTour(null);
  }}
/>
      ) : (
        <>
          <button className="btn btn-success mb-3" onClick={() => setShowForm(true)}>
            ➕ Thêm tour
          </button>
          <TourTable
            tours={tours}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
}
