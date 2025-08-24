// 📁 src/services/tourService.js
import { api } from "../../client/services/api";

export async function fetchTours() {
  const response = await api.get("/tours"); // đã gắn token sẵn từ api.js
  return response.data;
}
