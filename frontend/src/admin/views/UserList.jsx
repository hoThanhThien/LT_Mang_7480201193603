// UserList.jsx
import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser, updateUser } from "../services/userService";
import UserTable from "../components/tables/UserTable";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
  full_name: "",
  email: "",       // ✅ thêm dòng này
  phone: "",
  
});



  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá user này không?")) {
      await deleteUser(id);
      loadUsers();
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setForm({
  full_name: user.full_name,
  email: user.email,   // ✅ thêm dòng này
  phone: user.phone,
  
});

  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // 👇 Convert role_id về int trước khi gửi lên backend
  const data = form;

  await updateUser(editingUser.user_id, data);
  setEditingUser(null);
  loadUsers();
};


  return (
    <div className="user-list">
      <h2>Danh sách người dùng</h2>
      <UserTable users={users} onDelete={handleDelete} onEdit={handleEdit} />

      {editingUser && (
        <form onSubmit={handleSubmit} className="mt-4">
          <h4>Chỉnh sửa user #{editingUser.user_id}</h4>
          <div className="mb-2">
            <label>Full Name:</label>
            <input
              type="text"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="mb-2">
            <label>Phone:</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="form-control"
            />
          </div>
          <div className="mb-2">
  <label>Email:</label>
  <input
    type="email"
    value={form.email}
    onChange={(e) => setForm({ ...form, email: e.target.value })}
    className="form-control"
  />
</div>

          <button className="btn btn-success" type="submit">Lưu</button>
          <button className="btn btn-secondary ms-2" onClick={() => setEditingUser(null)}>Huỷ</button>
        </form>
      )}
    </div>
  );
}
