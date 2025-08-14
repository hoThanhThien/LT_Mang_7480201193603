import React, { useEffect, useState } from 'react';
import { fetchTours } from '../services/tourService';

export default function TourList() {
  const [tours, setTours] = useState([]);
  useEffect(() => {
    fetchTours().then(setTours);
  }, []);
  return (
    <div>
      <h2>Tour List</h2>
      <ul>
        {tours.map(t => <li key={t.tour_id}>{t.title}</li>)}
      </ul>
    </div>
  );
}
