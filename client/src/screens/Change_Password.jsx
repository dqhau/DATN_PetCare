import React, { useState } from "react";
import {
  Breadcrumb,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

import { Lock, Unlock, ShieldLock, KeyFill } from "react-bootstrap-icons";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "../style/auth-forms.css";

const Change_Password = () => {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [reNewPass, setReNewPass] = useState("");
  const username = localStorage.getItem("username");
  const nav = useNavigate();

  const handleUpdate = () => {
    if (!oldPass || !newPass || !reNewPass) {
      toast.error("Please fill in all fields!");
      return;
    }
    if (newPass !== reNewPass) {
      toast.error("New passwords do not match!");
      return;
    }
    if (oldPass === newPass && oldPass === reNewPass) {
      toast.error("The new password must be different from the old password");
      return;
    }

    console.log(`Sending request to update password for user: ${username}`);
    console.log(`New password: ${newPass}`);

    axios
      .put(`http://localhost:9999/users/changepass/${username}`, {
        oldPassword: oldPass,
        newPassword: newPass,
      })
      .then((response) => {
        if (response.data.status) {
          toast.success("Change password successfully!");
          setOldPass("");
          setNewPass("");
          setReNewPass("");
          nav("/");
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error.message);
        toast.error(
          error.response
            ? error.response.data.message
            : "Change password failed!"
        );
      });
  };

  return (
    <Container fluid>
      <Row className="ml-2" style={{ marginTop: '0', marginBottom: '0' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Thay đổi mật khẩu</Breadcrumb.Item>
        </Breadcrumb>
      </Row>
      <Container className="auth-container" style={{ height: 'auto', padding: '0', margin: '0 auto' }}>
        <div className="auth-card">
          <div className="auth-header" style={{ paddingTop: "1rem", paddingBottom: "0" }}>
            <div className="auth-logo">
              <ShieldLock size={30} color="#4dabf7" />
            </div>
            <h2 className="auth-title" style={{ fontSize: "1.3rem", marginBottom: "0.1rem" }}>Đổi mật khẩu</h2>
            <p className="auth-subtitle" style={{ fontSize: "0.8rem", marginBottom: "0.5rem" }}>Cập nhật mật khẩu mới để bảo vệ tài khoản</p>
          </div>
          
          <Form className="auth-form" style={{ padding: "0.8rem 1.5rem 1rem" }}>
            <Form.Group className="auth-input-group" style={{ marginBottom: "0.7rem" }}>
              <Form.Label className="auth-label" style={{ marginBottom: "0.3rem", fontSize: "0.85rem" }}>Mật khẩu hiện tại</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <Lock />
                  </span>
                </div>
                <Form.Control
                  type="password"
                  className="auth-input"
                  placeholder="Nhập mật khẩu hiện tại"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  required
                />
              </div>
            </Form.Group>
            
            <Form.Group className="auth-input-group" style={{ marginBottom: "0.7rem" }}>
              <Form.Label className="auth-label" style={{ marginBottom: "0.3rem", fontSize: "0.85rem" }}>Mật khẩu mới</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <KeyFill />
                  </span>
                </div>
                <Form.Control
                  type="password"
                  className="auth-input"
                  placeholder="Nhập mật khẩu mới"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  required
                />
              </div>
            </Form.Group>
            
            <Form.Group className="auth-input-group" style={{ marginBottom: "0.7rem" }}>
              <Form.Label className="auth-label" style={{ marginBottom: "0.3rem", fontSize: "0.85rem" }}>Xác nhận mật khẩu</Form.Label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    <KeyFill />
                  </span>
                </div>
                <Form.Control
                  type="password"
                  className="auth-input"
                  placeholder="Nhập lại mật khẩu mới"
                  value={reNewPass}
                  onChange={(e) => setReNewPass(e.target.value)}
                  required
                />
              </div>
            </Form.Group>
            
            <Button variant="primary" onClick={handleUpdate} className="auth-btn" style={{ marginTop: "0.5rem", marginBottom: "0.7rem" }}>
              Cập nhật mật khẩu
            </Button>
            
            <div className="text-center">
              <a href="/" className="auth-link" style={{ marginBottom: "0.2rem" }}>
                &larr; Trở về trang chủ
              </a>
            </div>
            
            <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
              <h5 style={{ fontSize: "1rem", color: "#495057", marginBottom: "15px" }}>Hướng dẫn tạo mật khẩu mạnh</h5>
              <ul style={{ paddingLeft: "20px", fontSize: "0.85rem", color: "#6c757d" }}>
                <li style={{ marginBottom: "8px" }}>Độ dài ít nhất 8 ký tự</li>
                <li style={{ marginBottom: "8px" }}>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                <li style={{ marginBottom: "8px" }}>Tránh sử dụng thông tin cá nhân dễ đoán</li>
              </ul>
            </div>
            
            <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#fff3cd", borderRadius: "8px", marginBottom: "100px" }}>
              <h5 style={{ fontSize: "1rem", color: "#664d03", marginBottom: "15px" }}>Lưu ý quan trọng</h5>
              <p style={{ fontSize: "0.85rem", color: "#664d03" }}>
                Không bao giờ chia sẻ mật khẩu của bạn với người khác, kể cả nhân viên hỗ trợ của PetCare.
              </p>
            </div>
          </Form>
        </div>
      </Container>
    </Container>
  );
};

export default Change_Password;
