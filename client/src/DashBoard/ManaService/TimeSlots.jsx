import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { PenFill, PlusSquareFill, Trash } from "react-bootstrap-icons";
import AddTimeSlot from "./AddTimeSlot";
import EditTimeSlot from "./EditTimeSlot";
import axios from "axios";

const TimeSlots = () => {
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [dataEdit, setDataEdit] = useState([]);
  const [slots, setSlots] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Hàm để làm mới dữ liệu
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Hàm để tải dữ liệu timeslot
  const loadTimeslots = () => {
    axios
      .get("http://localhost:9999/timeslots")
      .then((res) => {
        // Sắp xếp timeslot theo giờ từ 7 đến 17
        const sortedSlots = [...res.data].sort((a, b) => {
          // Sắp xếp theo giờ
          return a.time - b.time;
        });
        setSlots(sortedSlots);
      })
      .catch((error) => {
        console.error("Error fetching time slots:", error);
        alert("Không thể tải danh sách khung giờ. Vui lòng thử lại sau.");
      });
  };
  
  useEffect(() => {
    loadTimeslots();
  }, [refreshTrigger]); // Thêm refreshTrigger vào dependency array

  const handleDeleteSlot = (id) => {
    if (window.confirm("Bạn có muốn xóa time slot này không?")) {
      // Lấy token xác thực từ localStorage
      const token = localStorage.getItem('accessToken');
      
      axios
        .delete(`http://localhost:9999/timeslots/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then((response) => {
          setSlots(slots.filter((slot) => slot._id !== id));
          alert("Xóa time slot thành công");
          refreshData(); // Làm mới dữ liệu
        })
        .catch((error) => {
          console.error("Failed to delete time slot:", error);
          if (error.response && error.response.data && error.response.data.message) {
            alert(`Lỗi: ${error.response.data.message}`);
          } else {
            alert("Không thể xóa time slot. Vui lòng thử lại sau.");
          }
        });
    }
  };

  const handleEditSlot = (slot) => {
    setDataEdit(slot);
    setEditVisible(true);
  };

  return (
    <Container fluid>
      <Row style={{ width: "100%" }}>
        <Col md={12}>
          <div>
            <Row className="ml-1 mb-4 mt-4">
              <Col md={12} className="d-flex justify-content-end align-items-center">
                <Button 
                  variant="primary" 
                  onClick={() => setVisible(true)}
                >
                  <PlusSquareFill className="me-2" />
                  Thêm timeslot
                </Button>
              </Col>
            </Row>
          </div>

          <Table striped bordered hover>
            <thead className="text-center">
              <tr>
                <th>ID</th>
                <th>Thời gian (giờ)</th>
                <th>Số lượng chỗ trống</th>
                <th>Trạng thái</th>
                <th colSpan={2}>Hành động</th>
              </tr>
            </thead>

            <tbody className="text-center">
              {slots.map((slot, index) => {
                // Xác định trạng thái dựa trên số lượng slot còn trống
                const status = slot.availableSlots > 0 ? 
                  <span className="badge badge-success">Còn trống</span> : 
                  <span className="badge badge-danger">Đã đầy</span>;
                
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{slot.time} giờ</td>
                    <td>{slot.availableSlots}</td>
                    <td>{status}</td>
                    <td>
                      <i
                        className="delete"
                        onClick={() => handleDeleteSlot(slot._id)}
                      >
                        <Trash
                          style={{
                            color: "red",
                            fontSize: "25px",
                            cursor: "pointer",
                          }}
                        />
                      </i>
                    </td>
                    <td>
                      <i className="edit">
                        <PenFill
                          style={{
                            color: "blue",
                            fontSize: "25px",
                            cursor: "pointer",
                          }}
                          onClick={() => handleEditSlot(slot)}
                        />
                      </i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
      {visible && <AddTimeSlot 
        visible={visible} 
        setVisible={setVisible} 
        onSuccess={refreshData} 
      />}
      {editVisible && (
        <EditTimeSlot
          editVisible={editVisible}
          setEditVisible={setEditVisible}
          data={dataEdit}
          slotId={dataEdit._id}
          onSuccess={refreshData}
        />
      )}
      

    </Container>
  );
};

export default TimeSlots;
