import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../services/userService';

export default function UserList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, []);
  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(u => <li key={u.user_id}>{u.full_name}</li>)}
      </ul>
    </div>
  );
}
