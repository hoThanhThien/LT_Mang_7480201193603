// 📁 src/views/TourList.jsx
import React, { useEffect, useState } from 'react';
import { fetchTours } from '../services/tourService';
import TourTable from '../components/tables/TourTable';

export default function TourList() {
  const [tours, setTours] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchTours();
        setTours(data.items); // ✅ Lấy đúng mảng tour
      } catch (err) {
        console.error("Lỗi tải tour:", err);
      }
    }

    loadData();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Danh sách Tour</h2>
      <TourTable tours={tours} />
    </div>
  );
}
