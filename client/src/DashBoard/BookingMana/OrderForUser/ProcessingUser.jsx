import React, { useEffect, useState } from "react";
import axios from "axios";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons";

import OrderDetail from "./OrderDetail";

const ProcessingUser = ({ status }) => {
  const [orders, setOrders] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9999/booking/${userId}/${status}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [status]);

  const formatDate = (inputDate) => {
    const dateObject = new Date(inputDate);
    const day = dateObject.getDate().toString().padStart(2, "0");
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObject.getFullYear();
    return `${day}-${month}-${year}`;
  };

  function formatCurrency(number) {
    // Sử dụng hàm toLocaleString() để định dạng số thành chuỗi với ngăn cách hàng nghìn và mặc định là USD.
    if (typeof number === "number") {
      return number.toLocaleString("en-US", {
        currency: "VND",
      });
    }
  }

  const handleOrderDetail = (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    setSelectedOrder(order);
    setVisible(true);
  };

  return (
    <Container fluid>
      <Row className="ml-1 mb-4 mt-4">
        <Col md={6}></Col>
      </Row>
      <Row style={{ width: "100%" }}>
        <Col md={12}>
          <Table striped bordered hover>
            <thead className="text-center">
              <tr>
                <th>STT</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Operation</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {orders.map((order,index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.status}</td>

                  <td>{formatCurrency(order.totalAmount) + " ₫"}</td>
                  
                  <td>
                    <i className="edit">
                      <Eye
                        style={{
                          color: "blue",
                          fontSize: "25px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleOrderDetail(order._id)}
                      />
                    </i>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      {visible && (
        <OrderDetail
          visible={visible}
          setVisible={setVisible}
          order={selectedOrder}
        />
      )}
    </Container>
  );
};
export default ProcessingUser;
