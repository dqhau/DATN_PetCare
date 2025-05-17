import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../style/forgot.css";
import axios from "axios";
import { Breadcrumb, Container, Row, Alert, Spinner, Card, Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { FaEnvelope, FaArrowLeft, FaLock } from "react-icons/fa";

const Forgot_Password = () => {
  const [gmail, setGmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    
    axios
      .post("http://localhost:9999/users/forgot-password", { gmail })
      .then((res) => {
        if (res.data.Status === "Success") {
          setMessage({
            type: "success",
            text: "Đã gửi email đặt lại mật khẩu! Vui lòng kiểm tra hộp thư của bạn."
          });
          toast.success("Đã gửi email đặt lại mật khẩu!");
          // Không chuyển hướng ngay để người dùng có thể đọc thông báo
          setTimeout(() => {
            navigate("/login");
          }, 5000);
        } else {
          setMessage({
            type: "danger",
            text: "Email không tồn tại!"
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage({
          type: "danger",
          text: err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau."
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Container fluid>
      <Row className="mt-3 mb-4 px-3">
        <Breadcrumb>
          <Breadcrumb.Item as={Link} to="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item as={Link} to="/login">Đăng nhập</Breadcrumb.Item>
          <Breadcrumb.Item active>Quên mật khẩu</Breadcrumb.Item>
        </Breadcrumb>
      </Row>
      
      <Row className="justify-content-center align-items-center" style={{ minHeight: '70vh', marginTop: '-50px' }}>
        <div className="col-md-6 col-lg-5 col-xl-4">
          <Card className="shadow border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <FaLock className="text-primary" size={40} />
                <h3 className="mt-3 mb-1">Quên mật khẩu?</h3>
                <p className="text-muted">Nhập email của bạn để nhận link đặt lại mật khẩu</p>
              </div>
              
              {message.text && (
                <Alert variant={message.type} className="text-center">
                  {message.text}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label className="d-flex align-items-center">
                    <FaEnvelope className="me-2" /> Email
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Nhập email nhận link cấp mật khẩu"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="py-2"
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-2 mt-3"
                  disabled={isSubmitting || !gmail}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi yêu cầu"
                  )}
                </Button>
              </Form>
              
              <div className="d-flex justify-content-between align-items-center mt-4 pt-2">
                <Link to="/login" className="text-decoration-none text-muted">
                  <FaArrowLeft className="me-1" /> Quay lại đăng nhập
                </Link>
                
                <Link to="/register" className="text-decoration-none">
                  Đăng ký tài khoản
                </Link>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Row>
    </Container>
  );
};

export default Forgot_Password;
