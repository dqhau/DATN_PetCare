import React from "react";
import { Breadcrumb, Col, Nav, Row, Tab } from "react-bootstrap";
import UserManagement from "../UserMana/UserManagement";
import BookingManagement from "./BookingManagement";
import Statistics from "./Statistics";
import TimeslotManagement from "./TimeslotManagement";
import ServiceManagement from "../ManaService/Manaservice";

const DashBoard = () => {
  // Lấy role từ localStorage
  const roleValue = localStorage.getItem("role");
  
  // Kiểm tra xem người dùng có quyền admin không
  const isAdmin = roleValue === "admin";
  return (
    <Tab.Container
      id="left-tabs-example"
      defaultActiveKey="first"
    >
      <Row className="mt-2 ml-2 d-flex justify-content-between align-items-center">
        <Col>
          <Breadcrumb>
            <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item active>Quản lý</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
        {/* Đã loại bỏ NotificationPanel vì đã có thông báo trong Header chính */}
      </Row>
      {isAdmin && (
        <Row style={{ marginTop: "50px" }}>
          <Col sm={2}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="second" style={{ color: "black" }}>
                  Quản lý người dùng
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="six" style={{ color: "black" }}>
                  Quản lý dịch vụ
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link eventKey="eight" style={{ color: "black" }}>
                  Quản lý đặt lịch
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="five" style={{ color: "black" }}>
                  Thống kê
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="timeslot" style={{ color: "black" }}>
                  Quản lý khung giờ
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="second">
                <UserManagement />
              </Tab.Pane>
              <Tab.Pane eventKey="five">
                <Statistics />
              </Tab.Pane>
              <Tab.Pane eventKey="six">
                <ServiceManagement />
              </Tab.Pane>

              <Tab.Pane eventKey="eight">
                <BookingManagement />
              </Tab.Pane>
              <Tab.Pane eventKey="timeslot">
                <TimeslotManagement />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      )}
    </Tab.Container>
  );
};

export default DashBoard;
