import React, { useRef, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/login.css";
import "../style/auth-forms.css";
import logo from "../assets/images/Pet_logo.png";
import { FaUser, FaLock, FaUserPlus, FaIdCard, FaCheckCircle } from "react-icons/fa";

const RegisterForm = () => {
  const [confirmPassword, setConfirmPassword] = useState("");
  const formRef = useRef(null);
  const nav = useNavigate();
  const [error, setError] = useState(null);

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = formRef.current;
    const username = form.elements["input-name"].value;
    const password = form.elements["password_field"].value;
    const fullname = form.elements["input-fullname"].value;

    // Kiểm tra mật khẩu xác nhận
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const data = { fullname, username, password };
    try {
      const res = await axios.post(
        "http://localhost:9999/users/register",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { accessToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      toast.success("Registration successful!");
      nav("/login");
    } catch (error) {
      if (error.response.status === 409) {
        setError("Username already exists");
        toast.error("Username already exists"); // Hiển thị thông báo trên toast
      } else {
        setError(error.response.data.error);
        toast.error(error.response.data.error);
      }
    }
  };

  return (
    <div className="auth-container">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={7} lg={5}>
            <Card className="auth-card">
              <div className="auth-header">
                <div className="auth-logo">
                  <img
                    src={logo}
                    height={90}
                    alt="logo"
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <h2 className="auth-title">Đăng ký tài khoản</h2>
              </div>
              
              <div className="auth-form">
                {error && <div className="auth-error">{error}</div>}
                
                <form ref={formRef} onSubmit={handleRegister}>
                  <div className="auth-input-group">
                    <label className="auth-label" htmlFor="fullname_field">
                      <FaIdCard className="me-2" /> Họ và tên
                    </label>
                    <input
                      placeholder="Nhập họ tên đầy đủ của bạn"
                      name="input-fullname"
                      type="text"
                      className="auth-input"
                      id="fullname_field"
                      required
                    />
                  </div>
                  
                  <div className="auth-input-group">
                    <label className="auth-label" htmlFor="username_field">
                      <FaUser className="me-2" /> Tên đăng nhập
                    </label>
                    <input
                      placeholder="Chọn tên đăng nhập của bạn"
                      name="input-name"
                      type="text"
                      className="auth-input"
                      id="username_field"
                      required
                    />
                  </div>
                  
                  <div className="auth-input-group">
                    <label className="auth-label" htmlFor="password_field">
                      <FaLock className="me-2" /> Mật khẩu
                    </label>
                    <input
                      placeholder="Tạo mật khẩu mới"
                      name="password_field"
                      type="password"
                      className="auth-input"
                      id="password_field"
                      required
                    />
                  </div>
                  
                  <div className="auth-input-group">
                    <label className="auth-label" htmlFor="confirm_password_field">
                      <FaCheckCircle className="me-2" /> Xác nhận mật khẩu
                    </label>
                    <input
                      placeholder="Nhập lại mật khẩu"
                      name="confirm_password_field"
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className="auth-input"
                      id="confirm_password_field"
                      required
                    />
                  </div>
                  
                  <Button
                    variant="success"
                    className="auth-btn"
                    type="submit"
                  >
                    <FaUserPlus className="me-2" /> Đăng ký ngay
                  </Button>
                  
                  <div className="auth-divider">
                    <span className="auth-divider-text">hoặc</span>
                  </div>
                  
                  <Link to={"/login"} className="auth-link">
                    Đã có tài khoản? Đăng nhập ngay
                  </Link>
                </form>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default RegisterForm;
