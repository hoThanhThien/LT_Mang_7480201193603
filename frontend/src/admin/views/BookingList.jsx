import React, { useEffect, useState } from 'react';
import { fetchBookings } from '../services/bookingService';

export default function BookingList() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    fetchBookings().then(setBookings);
  }, []);
  return (
    <div>
      <h2>Booking List</h2>
      <ul>
        {bookings.map(b => <li key={b.booking_id}>{b.status}</li>)}
      </ul>
    </div>
  );
}
