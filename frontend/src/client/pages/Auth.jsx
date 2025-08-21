// 📁 src/pages/Auth.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import loginImg from "../../assets/Vinh-Ha-Long.jpg";
import registerImg from "../../assets/Phu-sy.jpg";

import "../../styles/Auth.css";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      const res = login(form);
      if (res.success) {
        setUser(res.user);
        navigate("/");
      } else {
        setError(res.message);
      }
    } else {
      const res = register(form);
      if (res.success) {
        setIsLogin(true);
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className={`auth-container ${isLogin ? "login-mode" : "register-mode"}`}>
        <div className="auth-box">
          <div className="form-section">
            <form onSubmit={handleSubmit} className="auth-form">
              <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
              {error && <div className="auth-error">{error}</div>}
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Họ và tên"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Mật khẩu"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="submit" className="submit-btn">
                {isLogin ? "Đăng nhập" : "Đăng ký"}
              </button>
            </form>
          </div>
          <div
            className="image-section"
            style={{
              backgroundImage: `url(${isLogin ? loginImg : registerImg})`
            }}
          >
            <div className="image-content">
              <h2>{isLogin ? "Chào mừng trở lại!" : "Tạo tài khoản mới"}</h2>
              <p>{isLogin ? "Bạn chưa có tài khoản?" : "Đã có tài khoản?"}</p>
              <button
                className="toggle-btn"
                onClick={() => {
                  setError("");
                  setIsLogin(!isLogin);
                }}
              >
                {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
