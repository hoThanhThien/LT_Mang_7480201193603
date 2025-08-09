export async function fetchCategories() {
  const response = await fetch('/api/categories');
  return response.json();
}
