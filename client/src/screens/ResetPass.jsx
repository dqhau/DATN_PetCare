import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../style/forgot.css";
import axios from "axios";
import { Container, Row, Breadcrumb, Alert, Spinner, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaLock, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";

const ResetPass = () => {
  const navigate = useNavigate();
  const { id, token } = useParams();
  
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Luôn cho phép người dùng đặt lại mật khẩu

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Kiểm tra mật khẩu
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    
    // Kiểm tra xác nhận mật khẩu
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setMessage({ type: "", text: "" });
      
      axios
        .post(`http://localhost:9999/users/reset-password/${id}/${token}`, {
          password: formData.password,
        })
        .then((res) => {
          if (res.data.Status === "Success") {
            setMessage({
              type: "success",
              text: "Mật khẩu đã được cập nhật thành công!"
            });
            toast.success("Mật khẩu đã được cập nhật thành công!");
            setTimeout(() => {
              navigate("/login");
            }, 3000);
          } else {
            setMessage({
              type: "danger",
              text: "Có lỗi xảy ra khi cập nhật mật khẩu"
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setMessage({
            type: "danger",
            text: err.response?.data?.message || "Có lỗi xảy ra khi cập nhật mật khẩu"
          });
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <Container fluid>
      <Row className="mt-3 mb-4 px-3">
        <Breadcrumb>
          <Breadcrumb.Item as={Link} to="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item as={Link} to="/login">Đăng nhập</Breadcrumb.Item>
          <Breadcrumb.Item active>Đặt lại mật khẩu</Breadcrumb.Item>
        </Breadcrumb>
      </Row>
      
      <Row className="justify-content-center">
        <div className="col-md-6 col-lg-5 col-xl-4">
          <Card className="shadow border-0 mb-5 reset-password-card">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="key-icon-container">
                  <img src="/key-icon.png" alt="Key Icon" className="key-icon" onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    const fallbackIcon = document.createElement('div');
                    fallbackIcon.className = 'key-icon-fallback';
                    e.target.parentNode.appendChild(fallbackIcon);
                  }} />
                </div>
                <h3 className="mt-3 mb-1">Đặt lại mật khẩu</h3>
                <p className="text-muted">Tạo mật khẩu mới cho tài khoản của bạn</p>
              </div>
              
              {message.text && (
                <Alert variant={message.type} className="text-center">
                  {message.text}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <div className="password-field-container mb-3">
                  <div className="password-label">
                    <FaLock className="lock-icon" /> Mật khẩu mới
                  </div>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className={`password-input ${errors.password ? 'is-invalid' : ''}`}
                      placeholder="Nhập mật khẩu mới"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    />
          
                  </div>
                  {errors.password && <div className="password-error">{errors.password}</div>}
                </div>
                
                <div className="password-field-container mb-4">
                  <div className="password-label">
                    <FaLock className="lock-icon" /> Xác nhận mật khẩu
                  </div>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      className={`password-input ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      placeholder="Nhập lại mật khẩu mới"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      required
                    />
      
                  </div>
                  {errors.confirmPassword && <div className="password-error">{errors.confirmPassword}</div>}
                </div>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="reset-password-btn w-100 py-2 mt-3"
                  disabled={isSubmitting || !formData.password || !formData.confirmPassword}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật mật khẩu"
                  )}
                </Button>
              </Form>
              
              <div className="d-flex justify-content-between align-items-center mt-4 pt-2">
                <Link to="/login" className="text-decoration-none text-muted">
                  <FaArrowLeft className="me-1" /> Quay lại đăng nhập
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default ResetPass;
