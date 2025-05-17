import React from "react";
import { Breadcrumb, Container, Row, Tab, Tabs } from "react-bootstrap";
import OrderStatus from "./OrderStatus";
import PendingUser from "./PendingUser";
import CompletedUser from "./CompletedUser";
import ProcessingUser from "./ProcessingUser";
import CancelUser from "./CancelUser";
import HistoryVacxin from "./HistoryVacxin";

const ViewOrderUser = () => {
  return (
    <Container fluid>
      <Row className="mt-2 ml-2">
        <Breadcrumb>
          <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Booking</Breadcrumb.Item>
        </Breadcrumb>
      </Row>

      <Container>
        <Tabs defaultActiveKey="tatca" id="uncontrolled-tab-example">
          <Tab eventKey="tatca" title="Tất cả">
            <OrderStatus />
          </Tab>
          <Tab eventKey="tiem" title="Lịch sử tiêm phòng">
            <HistoryVacxin />
          </Tab>
          <Tab eventKey="Pending" title="Chờ xác nhận">
            <PendingUser status="Pending" />
          </Tab>
          <Tab eventKey="Processing" title="Đang xử lí">
            <ProcessingUser status="Processing" />
          </Tab>
          <Tab eventKey="Completed" title="Đã hoàn thành">
            <CompletedUser status="Completed" />
          </Tab>
          <Tab eventKey="Cancel" title="Đã huỷ">
            <CancelUser status="Cancel" />
          </Tab>
        </Tabs>
      </Container>
    </Container>
  );
};

export default ViewOrderUser;
