// User service for FE
export async function fetchUsers() {
  const response = await fetch('/api/users');
  return response.json();
}
