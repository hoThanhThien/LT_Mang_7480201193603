// src/admin/services/userService.js
import { api } from "../../client/services/api"; // nếu bạn đã có instance axios ở đây

export const fetchUsers = async () => {
  try {
    const res = await api.get("/users"); // GET http://localhost:8000/users
    return res.data.items;               // chỉ lấy phần users
  } catch (err) {
    console.error("Failed to fetch users", err);
    return [];
  }
};
