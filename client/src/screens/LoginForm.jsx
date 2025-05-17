import React, { useRef, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import "../style/login.css";
import "../style/auth-forms.css";
import logo from "../assets/images/Pet_logo.png";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

const LoginForm = ({ setIsLoggedIn }) => {
  const formRef = useRef(null);
  const nav = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = formRef.current;
    const username = form.elements["input-name"].value;
    const password = form.elements["password_field"].value;

    const data = { username, password };

    try {
      const res = await axios.post("http://localhost:9999/users/login", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { accessToken, refreshToken, username, id, fullname, role } =
        res.data;
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("username", username); // Lưu tên người dùng vào localStorage
      localStorage.setItem("fullname", fullname); // Lưu tên người dùng vào localStorage
      localStorage.setItem("userId", id);
      localStorage.setItem("role", role);

      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      toast.success("Login successful!");
      nav("/");
    } catch (error) {
      setError(error.response.data.error);
      toast.error("Username or password is incorrect");
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
                <h2 className="auth-title">Đăng nhập</h2>
                <p className="auth-subtitle">
                  Chào mừng bạn trở lại! Vui lòng đăng nhập để tiếp tục.                  
                </p>
              </div>
              
              <div className="auth-form">
                {error && <div className="auth-error">{error}</div>}
                
                <form onSubmit={handleSubmit} ref={formRef}>
                  <div className="auth-input-group">
                    <label className="auth-label" htmlFor="email_field">
                      <FaUser className="me-2" /> Tên đăng nhập
                    </label>
                    <input
                      placeholder="Nhập tên đăng nhập của bạn"
                      name="input-name"
                      type="text"
                      className="auth-input"
                      id="email_field"
                      required
                    />
                  </div>
                  
                  <div className="auth-input-group">
                    <label className="auth-label" htmlFor="password_field">
                      <FaLock className="me-2" /> Mật khẩu
                    </label>
                    <input
                      placeholder="Nhập mật khẩu của bạn"
                      name="password_field"
                      type="password"
                      className="auth-input"
                      id="password_field"
                      required
                    />
                  </div>
                  
                  <Button
                    variant="primary"
                    className="auth-btn"
                    type="submit"
                  >
                    <FaSignInAlt className="me-2" /> Đăng nhập
                  </Button>
                  
                  <div className="auth-divider">
                    <span className="auth-divider-text">hoặc</span>
                  </div>
                  
                  <Link to={"/register"} className="auth-link">
                    Tạo tài khoản mới
                  </Link>
                  
                  <Link to={"/forgot"} className="auth-link">
                    Quên mật khẩu?
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

export default LoginForm;
