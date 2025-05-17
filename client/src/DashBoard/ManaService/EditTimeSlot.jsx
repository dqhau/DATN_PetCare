import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { PlusSquareFill, X } from "react-bootstrap-icons";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditTimeSlot = ({ editVisible, setEditVisible, data, slotId, onSuccess }) => {
  const [time, setTime] = useState(data.time);
  const [availableSlots, setAvailableSlots] = useState(data.availableSlots);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const onHide = () => {
    setEditVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Lấy token xác thực từ localStorage
      const token = localStorage.getItem('accessToken');
      
      const response = await axios.put(
        `http://localhost:9999/timeslots/${slotId}`,
        {
          time: parseInt(time),
          availableSlots: parseInt(availableSlots)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        toast.success("Cập nhật khung giờ thành công!");
        setEditVisible(false);
        // Gọi hàm callback để thông báo cho component cha cập nhật dữ liệu
        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error("Error updating time slot:", response.data);
        toast.error("Lỗi khi cập nhật khung giờ. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error updating time slot:", error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Lỗi: ${error.response.data.message}`);
      } else {
        toast.error("Lỗi khi cập nhật khung giờ. Vui lòng thử lại.");
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
        form="editSlotForm"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        <PlusSquareFill /> Lưu
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
        visible={editVisible}
        onHide={() => setEditVisible(false)}
        footer={dialogFooter}
        className="bg-light dialogForm"
        style={{ width: "70vw" }}
        modal
        header={<div className="custom-dialog-header">Sửa Time Slot</div>}
      >
        <div className="bg-light p-1" style={{ margin: "25px" }}>
          <div style={{ margin: "40px" }}>
            <form id="editSlotForm">
              <Row>
                <Col md={6}>
                  <div className="form-group w-full">
                    <label className="label" htmlFor="time">
                      <h6>Thời gian (hours) </h6>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="time"
                      placeholder="Sửa thời gian"
                      style={{ height: "50px" }}
                      required
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </Col>{" "}
                <Col md={6}>
                  <div className="form-group w-full">
                    <label className="label" htmlFor="availableSlots">
                      <h6>Số lượng chỗ trống </h6>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      name="availableSlots"
                      placeholder="Sửa số lượng chỗ trống"
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

export default EditTimeSlot;
