// Booking service for FE
export async function fetchBookings() {
  const response = await fetch('/api/bookings');
  return response.json();
}
