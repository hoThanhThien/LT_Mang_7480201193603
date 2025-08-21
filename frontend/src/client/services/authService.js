export const register = (userData) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const exists = users.find(u => u.email === userData.email);
  if (exists) return { success: false, message: "Email đã tồn tại" };

  users.push(userData);
  localStorage.setItem("users", JSON.stringify(users));
  return { success: true };
};

export const login = ({ email, password }) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    return { success: true, user };
  }
  return { success: false, message: "Sai email hoặc mật khẩu" };
};

export const logout = () => {
  localStorage.removeItem("currentUser");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentUser"));
};
