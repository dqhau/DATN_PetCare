import { Dialog } from "primereact/dialog";
import React, { useState, useEffect } from "react";
import { Button, Col, Row, Form } from "react-bootstrap";
import axios from "axios";

const OrderDetail = (props) => {
  const { visible, setVisible, order: initialOrder } = props;
  const [order, setOrder] = useState(initialOrder);
  const [cancelReason, setCancelReason] = useState("");
  const [isCanceling, setIsCanceling] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setOrder(initialOrder);
    setLoading(false);
  }, [initialOrder]);

  const onHide = () => {
    setVisible(false);
  };

  const handleCancelOrder = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        `http://localhost:9999/booking/update-status/${order._id}`,
        { cancel_reason: cancelReason } // Ensure the correct field name sent to backend
      );
      if (response.status === 200) {
        alert("Đơn hàng đã được hủy thành công");
        fetchOrderDetails(); // Fetch updated order details after cancellation
        onHide(); // Close the dialog after successful cancellation
      } else {
        throw new Error("Failed to cancel order");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi hủy đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:9999/booking/detail/${order._id}`
      );
      if (response.status === 200) {
        setOrder(response.data); // Update 'order' state with fetched data
      } else {
        throw new Error("Failed to fetch updated order details");
      }
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tải thông tin đơn hàng");
    }
  };

  const formatCurrency = (number) => {
    if (typeof number === "number") {
      return number.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      });
    }
    return "0 ₫";
  };

  const dialogFooter = (
    <div>
      <div
        style={{ display: "flex", justifyContent: "start", marginTop: "5px" }}
      >
        <h5>Total: {formatCurrency(order?.service_type?.price) + " ₫"}</h5>
      </div>
      <div style={{ display: "flex", justifyContent: "end" }}>
        {!isCanceling ? (
          <Button
            onClick={() => setIsCanceling(true)}
            className="btn btn-danger mr-2"
            disabled={
              order?.order_status === "Processing" ||
              order?.order_status === "Completed" ||
              order?.order_status === "Cancel" ||
              order?.paymentMethod === "VnPay"
            }
          >
            Huỷ đơn hàng
          </Button>
        ) : (
          <>
            <Form.Control
              as="select"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              style={{ marginRight: "10px", width: "200px" }}
            >
              <option value="">Chọn lý do</option>
              <option value="Thay đổi địa chỉ">Thay đổi địa chỉ</option>
              <option value="Tôi không có nhu cầu mua nữa">
                Tôi không có nhu cầu mua nữa
              </option>
              <option value="Thay đổi đơn hàng (giá, số lượng, ...)">
                Thay đổi đơn hàng (giá, số lượng, ...)
              </option>
              <option value="Khác">Khác</option>
            </Form.Control>
            <Button
              onClick={handleCancelOrder}
              className="btn btn-danger mr-2"
              disabled={!cancelReason || loading}
            >
              {loading ? "Đang xử lý..." : "Xác nhận huỷ"}
            </Button>
            <Button
              onClick={() => setIsCanceling(false)}
              className="btn btn-secondary mr-2"
            >
              Đóng
            </Button>
          </>
        )}
        <Button onClick={onHide} className="btn btn-danger">
          Đóng
        </Button>
      </div>
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <Dialog
        visible={visible}
        onHide={onHide}
        footer={dialogFooter}
        className="bg-light"
        style={{ width: "70vw" }}
        modal
        header={<div className="custom-dialog-header">Chi tiết đơn hàng</div>}
      >
        {order ? (
          <div className="bg-light p-1" style={{ margin: "25px" }}>
            <div style={{ margin: "40px" }}>
              <Row>
                <Col className="text-center">
                  <div className="table-responsive">
                    <table className="table table-condensed">
                      <thead>
                        <tr>
                          <th style={{ width: "15%" }}>Tên dịch vụ</th>
                          <th style={{ width: "25%" }}>Mô tả</th>
                          <th style={{ width: "15%" }}>Giá</th>
                          <th style={{ width: "15%" }}>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ verticalAlign: "middle" }}>
                            {order?.service_type?.name}
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            {order?.service_type?.description}
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            {formatCurrency(order?.service_type?.price)}
                          </td>
                          <td style={{ verticalAlign: "middle" }}>
                            {order?.service_type?.duration}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Col>
              </Row>
              {order.order_status === "Cancel" && (
                <Row>
                  <Col md={12}>
                    <div className="form-group w-full">
                      <label className="label">
                        <h6>Lý do huỷ đơn hàng</h6>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={order?.cancel_reason}
                        style={{ height: "50px" }}
                        readOnly
                      />
                    </div>
                  </Col>
                </Row>
              )}
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Dialog>
    </div>
  );
};

export default OrderDetail;
