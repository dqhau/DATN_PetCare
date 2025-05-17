import React, { useEffect, useState } from "react";
import { Col, Container, Row, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import images from "../assets/images/Pet_logo.png";
import "primeicons/primeicons.css";

import {
  ArrowRepeat,
  BoxArrowInRight,
  Calendar,
  PersonVcard,
  SendFill,
} from "react-bootstrap-icons";
import NotificationSystem from "./NotificationSystem";
import { FaPaw } from "react-icons/fa";
import axios from "axios";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const nav = useNavigate();
  const role = localStorage.getItem("role");
  const fullname = localStorage.getItem("fullname");
  const [services, setServices] = useState([]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    nav("/");
  };



  useEffect(() => {
    axios
      .get("http://localhost:9999/service")
      .then((res) => setServices(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleBookingClick = () => {
    if (isLoggedIn) {
      nav("/online-booking");
    } else {
      nav("/login");
    }
  };

  return (
    <Container fluid className="mt-2">
      <Row className="align-items-center">
        <Col md={2} className="d-flex justify-content-center mt-2">
          <Link to={"/"}>
            <div>
              <img
                src={images}
                alt="Description of the image"
                style={{ maxWidth: "200px", height: "auto" }}
              />
            </div>
          </Link>
        </Col>

        <Col
          md={7}
          className="d-flex justify-content-center align-items-center"
        >
          <div className="d-flex">
            <ul className="list-unstyled d-flex justify-content-between m-0">
              <li className="mr-4 d-flex align-items-center">
                <Link to="/" style={{ color: "#2a3977", fontWeight: "bold" }}>
                  Trang chủ
                </Link>
              </li>

              <li className="mr-4">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="link"
                    id="dropdown-services"
                    style={{ color: "#2a3977", fontWeight: "bold" }}
                  >
                    Dịch vụ
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {services.map((s) => (
                      <Dropdown.Item key={s._id} href="/#">
                        {s.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </li>
              <li className="mr-4 d-flex align-items-center">
                <Link
                  to="/contact"
                  style={{ color: "#2a3977", fontWeight: "bold" }}
                >
                  Liên hệ
                </Link>
              </li>

              {isLoggedIn && role === "admin" && (
                <li className="mr-4 d-flex align-items-center">
                  <Link
                    to="/dashboard"
                    style={{ color: "#2a3977", fontWeight: "bold" }}
                  >
                    Quản Lý
                  </Link>
                </li>
              )}
              <li className="mr-4 d-flex align-items-center">
                {isLoggedIn ? (
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="link"
                      id="dropdown-settings"
                      style={{ color: "#2a3977", fontWeight: "bold" }}
                    >
                      {fullname}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item href="/changepass">
                        <ArrowRepeat
                          style={{ fontSize: "20px", marginRight: "10px" }}
                        />
                        Thay đổi mật khẩu
                      </Dropdown.Item>
                      <Dropdown.Item href="/profile">
                        <PersonVcard
                          style={{ fontSize: "20px", marginRight: "10px" }}
                        />
                        Thông tin cá nhân
                      </Dropdown.Item>
                      <Dropdown.Item href="/pets">
                        <FaPaw
                          style={{ fontSize: "20px", marginRight: "10px", color: "#273172" }}
                        />
                        Thú cưng của tôi
                      </Dropdown.Item>

                      <Dropdown.Item href="/my-bookings">
                        <Calendar
                          style={{ fontSize: "20px", marginRight: "10px" }}
                        />
                        Lịch hẹn của tôi
                      </Dropdown.Item>
                      <Dropdown.Item onClick={handleLogout}>
                        <BoxArrowInRight
                          style={{ fontSize: "20px", marginRight: "10px" }}
                        />
                        Đăng xuất
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <Link
                    to="/login"
                    style={{ color: "#2a3977", fontWeight: "bold" }}
                  >
                    Đăng nhập
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </Col>

        <Col md={3} className="d-flex justify-content-center align-items-center">
          {isLoggedIn && (
            <div className="me-3">
              <NotificationSystem />
            </div>
          )}
          <div>
            <button
              onClick={handleBookingClick}
              className="btn btn-dark d-flex align-items-center rounded-pill mr-3"
            >
              <span>Đặt lịch Online</span>
              <SendFill className="ml-2" />
            </button>
          </div>
        </Col>
      </Row>

    </Container>
  );
};

export default Header;
