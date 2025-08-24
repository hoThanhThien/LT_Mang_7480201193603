import React, { useEffect, useState } from "react";
import { fetchUsers } from "../services/userService";
import UserTable from "../components/tables/UserTable";

export default function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUsers();
      console.log("📦 Fetched users:", data); // 👈 Thêm dòng này để debug
      setUsers(data);
    };
    loadUsers();
  }, []);

  return (
    <div className="user-list">
      <h2>User List</h2>
      <UserTable users={users} />
    </div>
  );
}
