// src/admin/components/tables/UserTable.jsx
import React from "react";

export default function UserTable({ users }) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Full Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.user_id}>
            <td>{u.user_id}</td>
            <td>{u.full_name}</td>
            <td>{u.email}</td>
            <td>{u.phone}</td>
            <td>{u.role_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
