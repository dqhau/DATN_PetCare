import React, { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Row,
  Col,
  Card,
  Container,
  Badge,
  ListGroup
} from "react-bootstrap";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBirthdayCake, FaEdit } from "react-icons/fa";
import EditProfile from "./EditProfile";
import "../style/profile.css";
import axios from "axios";

function Profile() {
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const [key, setKey] = useState("profile");

  // profile state
  const [profile, setProfile] = useState({});
  const [dataEdit, setDataEdit] = useState(null);
  const [editVisible, setEditVisible] = useState(false);

  // --- Load profile once ---
  useEffect(() => {
    fetch(`http://localhost:9999/users/${username}`)
      .then((resp) => resp.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, [username]);

  // handlers for profile
  const handleEditProfile = () => {
    setDataEdit(profile);
    setEditVisible(true);
  };
  const handleUpdateProfile = (id, updatedData) => {
    setProfile((prev) => ({ ...prev, ...updatedData }));
  };



  return (
    <div className="profile-page">
      <Container fluid>
        <Row className="mt-3 mb-4">
          <Col>
            <Breadcrumb>
              <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
              <Breadcrumb.Item active>Thông tin cá nhân</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="profile-card shadow-sm mb-4">
              <Card.Header className="bg-primary text-white py-3">
                <h4 className="mb-0">Hồ sơ người dùng</h4>
              </Card.Header>
              <Card.Body className="p-0">
                <Row className="g-0">
                  {/* Profile Image Column */}
                  <Col md={4} className="border-end">
                    <div className="text-center p-4 d-flex flex-column align-items-center">
                      <div className="position-relative mb-4">
                        <img
                          className="profile-img mb-3"
                          src={profile.avatar || "http://bootdey.com/img/Content/avatar/avatar1.png"}
                          alt="Profile"
                        />
                        <Badge 
                          bg="success" 
                          className="position-absolute bottom-0 end-0 p-2 rounded-circle">
                          <FaUser />
                        </Badge>
                      </div>
                      <h4 className="mb-1">{profile.fullname || username}</h4>
                      <p className="text-muted small mb-3">
                        <FaEnvelope className="me-1" />
                        {profile.gmail || "Chưa cập nhật email"}
                      </p>
                      <Button 
                        variant="outline-primary" 
                        className="d-flex align-items-center" 
                        onClick={handleEditProfile}>
                        <FaEdit className="me-2" /> Chỉnh sửa hồ sơ
                      </Button>
                    </div>
                  </Col>

                  {/* Profile Info Column */}
                  <Col md={8}>
                    <div className="p-4">
                      <h5 className="border-bottom pb-2 mb-4">Thông tin cá nhân</h5>
                      
                      <ListGroup variant="flush" className="profile-details">
                        <ListGroup.Item className="d-flex py-3">
                          <div className="profile-detail-icon me-3">
                            <FaUser className="text-primary" />
                          </div>
                          <div className="profile-detail-content">
                            <h6 className="mb-1">Họ và tên</h6>
                            <p className="mb-0">{profile.fullname || "Chưa cập nhật"}</p>
                          </div>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex py-3">
                          <div className="profile-detail-icon me-3">
                            <FaEnvelope className="text-primary" />
                          </div>
                          <div className="profile-detail-content">
                            <h6 className="mb-1">Email</h6>
                            <p className="mb-0">{profile.gmail || "Chưa cập nhật"}</p>
                          </div>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex py-3">
                          <div className="profile-detail-icon me-3">
                            <FaPhone className="text-primary" />
                          </div>
                          <div className="profile-detail-content">
                            <h6 className="mb-1">Số điện thoại</h6>
                            <p className="mb-0">{profile.phone || "Chưa cập nhật"}</p>
                          </div>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex py-3">
                          <div className="profile-detail-icon me-3">
                            <FaBirthdayCake className="text-primary" />
                          </div>
                          <div className="profile-detail-content">
                            <h6 className="mb-1">Ngày sinh</h6>
                            <p className="mb-0">{profile.birthday || "Chưa cập nhật"}</p>
                          </div>
                        </ListGroup.Item>

                        <ListGroup.Item className="d-flex py-3">
                          <div className="profile-detail-icon me-3">
                            <FaMapMarkerAlt className="text-primary" />
                          </div>
                          <div className="profile-detail-content">
                            <h6 className="mb-1">Địa chỉ</h6>
                            <p className="mb-0">{profile.address || "Chưa cập nhật"}</p>
                          </div>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {editVisible && (
          <EditProfile
            editVisible={editVisible}
            setEditVisible={setEditVisible}
            data={dataEdit}
            onUpdate={handleUpdateProfile}
          />
        )}
      </Container>
    </div>
  );
    }

    export default Profile;
