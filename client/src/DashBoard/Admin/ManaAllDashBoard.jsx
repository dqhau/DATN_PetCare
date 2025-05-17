import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import TotalDashBoard from "./TotalDashBoard";
import DashBoardShop_Service from "./DashBoardShop_Service";
import TotalServiceMana from "./Services/TotalServiceMana";

const ManaAllDashBoard = () => {
  // Chuyển đổi giá trị role từ localStorage thành số
  const role = parseInt(localStorage.getItem("role"), 10);
  return (
    <Container fluid>
      {role === 1 && (
        <Tabs defaultActiveKey="alldashboard" id="uncontrolled-tab-example">
          <Tab eventKey="alldashboard" title="Tổng hợp">
            <DashBoardShop_Service />
          </Tab>
          <Tab eventKey="shop" title="Cửa hàng">
            <TotalDashBoard />
          </Tab>
          <Tab eventKey="service" title="Dịch vụ">
            <TotalServiceMana />
          </Tab>
        </Tabs>
      )}
      {role === 2 && (
        <Tabs defaultActiveKey="shop" id="uncontrolled-tab-example">
          <Tab eventKey="shop" title="Cửa hàng">
            <TotalDashBoard />
          </Tab>
        </Tabs>
      )}
      {role === 3 && (
        <Tabs defaultActiveKey="service" id="uncontrolled-tab-example">
          <Tab eventKey="service" title="Dịch vụ">
            <TotalServiceMana />
          </Tab>
        </Tabs>
      )}
    </Container>
  );
};

export default ManaAllDashBoard;
