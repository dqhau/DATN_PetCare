import React, { useState } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { PlusSquareFill, X } from "react-bootstrap-icons";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddTimeSlot = (props) => {
  const { visible, setVisible, onSuccess } = props;
  const [time, setTime] = useState(7);
  const [availableSlots, setAvailableSlots] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const onHide = () => {
    setVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Lấy token xác thực từ localStorage
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.post("http://localhost:9999/timeslots", {
        time: parseInt(time), // Đảm bảo time là kiểu Number
        availableSlots: parseInt(availableSlots),
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        toast.success("Thêm khung giờ thành công!");
        setVisible(false);
        // Gọi hàm callback để thông báo cho component cha cập nhật dữ liệu
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error("Lỗi khi thêm khung giờ:", response.data);
        toast.error("Lỗi khi thêm khung giờ. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm khung giờ:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Lỗi: ${error.response.data.message}`);
      } else {
        toast.error("Lỗi khi thêm khung giờ. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const dialogFooter = (
    <div style={{ margin: "20px", textAlign: "end" }}>
      <Button
        className="btn btn-success mr-2"
        type="button"
        form="addSlotForm"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        <PlusSquareFill /> Thêm
      </Button>
      <Button onClick={onHide} className="btn btn-danger">
        <X style={{ fontSize: "22px" }} />
        Đóng
      </Button>
    </div>
  );

  return (
    <div className="card flex justify-content-center">
      <Dialog
        visible={visible}
        onHide={() => setVisible(false)}
        footer={dialogFooter}
        className="bg-light dialogForm"
        style={{ width: "70vw" }}
        modal
        header={<div className="custom-dialog-header">Thêm ca dịch vụ</div>}
      >
        <div className="bg-light p-1" style={{ margin: "25px" }}>
          <div style={{ margin: "40px" }}>
            <form id="addSlotForm">
              <Row>
                <Col md={6}>
                  <div className="form-group w-full">
                    <label className="label" htmlFor="time">
                      <h6>Giờ (7-17)</h6>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="time"
                      placeholder="Nhập giờ (7-17)"
                      style={{ height: "50px" }}
                      required
                      min="7"
                      max="17"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                  
                  <div className="form-group w-full mt-3">
                    <label className="label" htmlFor="availableSlots">
                      <h6>Số lượng chỗ trống</h6>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="availableSlots"
                      placeholder="Nhập số lượng chỗ trống"
                      style={{ height: "50px" }}
                      required
                      min="1"
                      value={availableSlots}
                      onChange={(e) => setAvailableSlots(e.target.value)}
                    />
                  </div>
                </Col>
              </Row>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default AddTimeSlot;
