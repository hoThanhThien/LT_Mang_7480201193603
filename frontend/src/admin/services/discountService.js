export async function fetchDiscounts() {
  const response = await fetch('/api/discounts');
  return response.json();
}
