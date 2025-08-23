// src/client/pages/UserProfile.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../../styles/UserProfile.css";
import { changePassword } from "../services/authService";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", text: "" });

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const validate = () => {
    if (!oldPw || !newPw || !confirmPw) return "Vui lòng nhập đầy đủ thông tin.";
    if (newPw !== confirmPw) return "Mật khẩu mới và xác nhận không khớp.";
    if (newPw.length < 8) return "Mật khẩu mới tối thiểu 8 ký tự.";
    if (newPw === oldPw) return "Mật khẩu mới không được trùng mật khẩu cũ.";
    return null;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setAlert({ type: "", text: "" });

    const err = validate();
    if (err) {
      setAlert({ type: "danger", text: err });
      return;
    }

    try {
      setLoading(true);
      await changePassword(oldPw, newPw); // axios interceptor tự gắn Bearer token
      setAlert({ type: "success", text: "Đổi mật khẩu thành công." });
      setOldPw(""); setNewPw(""); setConfirmPw("");

      // Nếu backend thu hồi token cũ sau khi đổi mật khẩu, bỏ comment dòng dưới:
      // await handleLogout();
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data ||
        "Đổi mật khẩu thất bại. Kiểm tra lại mật khẩu hiện tại.";
      setAlert({ type: "danger", text: String(msg) });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="alert alert-warning text-center p-4 shadow">
          <h4 className="mb-3">Bạn chưa đăng nhập</h4>
          <Link to="/auth" className="btn btn-primary">Đăng nhập ngay</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow border-0 p-4" style={{ maxWidth: "600px", width: "100%" }}>
        <h2 className="mb-4 text-center text-primary">Trang cá nhân</h2>

        {/* Thông tin người dùng */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Họ và tên:</label>
          <div className="form-control-plaintext">
            {user.full_name || user.name || "Chưa cập nhật"}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Email:</label>
          <div className="form-control-plaintext">{user.email}</div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Số điện thoại:</label>
          <div className="form-control-plaintext">{user.phone || "Chưa cập nhật"}</div>
        </div>

        {/* Nút hiển thị form đổi mật khẩu */}
        <div className="text-center">
          <button
            className="btn btn-outline-secondary"
            onClick={() => setShowForm((s) => !s)}
          >
            {showForm ? "Ẩn form đổi mật khẩu" : "Đổi mật khẩu"}
          </button>
        </div>

        {/* Form đổi mật khẩu */}
        {showForm && (
          <form className="mt-4" onSubmit={onSubmit}>
            {alert.text && (
              <div className={`alert alert-${alert.type}`} role="alert">
                {alert.text}
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Mật khẩu hiện tại</label>
              <input
                type="password"
                className="form-control"
                value={oldPw}
                onChange={(e) => setOldPw(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Mật khẩu mới</label>
              <input
                type="password"
                className="form-control"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                autoComplete="new-password"
                required
              />
              <div className="form-text">Tối thiểu 8 ký tự.</div>
            </div>

            <div className="mb-3">
              <label className="form-label">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                className="form-control"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="d-flex justify-content-end gap-2">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Đang đổi..." : "Xác nhận đổi mật khẩu"}
              </button>
            </div>
          </form>
        )}

        {/* Đăng xuất */}
        <div className="text-center">
          <button onClick={handleLogout} className="btn btn-outline-danger mt-4">
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
