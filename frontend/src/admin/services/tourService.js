// Tour service for FE
export async function fetchTours() {
  const response = await fetch('/api/tours');
  return response.json();
}
