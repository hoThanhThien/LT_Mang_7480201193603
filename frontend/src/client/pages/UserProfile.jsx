import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/auth");
  };

  if (!user) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-warning text-center p-4 shadow">
          <h4 className="mb-3">Bạn chưa đăng nhập</h4>
          <a href="/auth" className="btn btn-primary">Đăng nhập ngay</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg border-0 p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h2 className="mb-4 text-center text-primary">Trang cá nhân</h2>

        <div className="mb-3">
          <label className="form-label fw-semibold">Tên:</label>
          <div className="form-control-plaintext">{user.name}</div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email:</label>
          <div className="form-control-plaintext">{user.email}</div>
        </div>

        <div className="text-center">
          <button onClick={handleLogout} className="btn btn-outline-danger mt-3">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
