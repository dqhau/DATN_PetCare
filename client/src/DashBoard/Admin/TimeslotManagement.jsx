import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Badge } from 'react-bootstrap';
import axios from 'axios';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { MultiSelect } from 'primereact/multiselect';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';

const TimeslotManagement = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [maxSlots, setMaxSlots] = useState(5);
  const toast = useRef(null);

  const timeOptions = [
    { label: '8:00', value: '8:00' },
    { label: '9:00', value: '9:00' },
    { label: '10:00', value: '10:00' },
    { label: '11:00', value: '11:00' },
    { label: '12:00', value: '12:00' },
    { label: '13:00', value: '13:00' },
    { label: '14:00', value: '14:00' },
    { label: '15:00', value: '15:00' },
    { label: '16:00', value: '16:00' },
    { label: '17:00', value: '17:00' },
    { label: '18:00', value: '18:00' }
  ];

  // Tải danh sách timeslot cho ngày đã chọn
  useEffect(() => {
    if (selectedDate) {
      fetchSlotsByDate(selectedDate);
    }
  }, [selectedDate]);

  // Lấy danh sách timeslot theo ngày
  const fetchSlotsByDate = async (date) => {
    try {
      setLoading(true);
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const res = await axios.get(`http://localhost:9999/timeslots?date=${formattedDate}`);
      setSlots(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching slots:", err);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể lấy danh sách khung giờ',
        life: 3000
      });
      setLoading(false);
    }
  };

  // Tạo timeslot cho ngày đã chọn
  const createTimeslotForDate = async () => {
    if (!selectedDate) {
      toast.current.show({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng chọn ngày',
        life: 3000
      });
      return;
    }

    if (selectedTimes.length === 0) {
      toast.current.show({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng chọn ít nhất một khung giờ',
        life: 3000
      });
      return;
    }

    try {
      setLoading(true);
      const formattedDate = new Date(selectedDate).toISOString().split('T')[0];
      
      const response = await axios.post('http://localhost:9999/timeslots/batch', {
        date: formattedDate,
        times: selectedTimes,
        maxSlots: maxSlots
      });
      
      toast.current.show({
        severity: 'success',
        summary: 'Thành công',
        detail: `Đã tạo ${response.data.created.length} khung giờ`,
        life: 3000
      });
      
      // Refresh danh sách
      fetchSlotsByDate(selectedDate);
      setLoading(false);
    } catch (err) {
      console.error("Error creating timeslots:", err);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể tạo khung giờ',
        life: 3000
      });
      setLoading(false);
    }
  };

  // Tạo nhanh timeslot cho 10 ngày kể từ hôm nay
  const createTimeslotsForNext10Days = async () => {
    try {
      setLoading(true);
      
      // Tính ngày bắt đầu (hôm nay) và ngày kết thúc (hôm nay + 9 ngày)
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 9);
      
      // Chuyển đổi sang định dạng YYYY-MM-DD
      const startDateStr = today.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // Sử dụng tất cả các khung giờ
      const timeValues = timeOptions.map(option => option.value);
      
      const response = await axios.post('http://localhost:9999/timeslots/generate-for-range', {
        startDate: startDateStr,
        endDate: endDateStr,
        timeSlots: timeValues,
        maxSlots: maxSlots
      });
      
      toast.current.show({
        severity: 'success',
        summary: 'Thành công',
        detail: `Đã tạo timeslot cho 10 ngày kể từ hôm nay (${startDateStr} đến ${endDateStr})`,
        life: 3000
      });
      
      // Nếu đã chọn ngày, refresh danh sách
      if (selectedDate) {
        fetchSlotsByDate(selectedDate);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error creating timeslots for next 10 days:", err);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể tạo timeslot cho 10 ngày tiếp theo',
        life: 3000
      });
      setLoading(false);
    }
  };
  
  // Tạo timeslot cho khoảng thời gian
  const createTimeslotsForRange = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      toast.current.show({
        severity: 'warn',
        summary: 'Cảnh báo',
        detail: 'Vui lòng chọn khoảng thời gian',
        life: 3000
      });
      return;
    }

    try {
      setLoading(true);
      const startDate = new Date(dateRange[0]).toISOString().split('T')[0];
      const endDate = new Date(dateRange[1]).toISOString().split('T')[0];
      
      const timeValues = selectedTimes.length > 0 
        ? selectedTimes 
        : timeOptions.map(option => option.value);
      
      const response = await axios.post('http://localhost:9999/timeslots/generate-for-range', {
        startDate,
        endDate,
        timeSlots: timeValues,
        maxSlots
      });
      
      toast.current.show({
        severity: 'success',
        summary: 'Thành công',
        detail: response.data.message,
        life: 3000
      });
      
      // Nếu đã chọn ngày, refresh danh sách
      if (selectedDate) {
        fetchSlotsByDate(selectedDate);
      }
      
      setLoading(false);
    } catch (err) {
      console.error("Error creating timeslots for range:", err);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể tạo khung giờ cho khoảng thời gian',
        life: 3000
      });
      setLoading(false);
    }
  };

  // Cập nhật trạng thái timeslot
  const updateTimeslotStatus = async (id, isActive) => {
    try {
      await axios.put(`http://localhost:9999/timeslots/${id}`, {
        isActive: !isActive
      });
      
      // Refresh danh sách
      fetchSlotsByDate(selectedDate);
      
      toast.current.show({
        severity: 'success',
        summary: 'Thành công',
        detail: `Đã ${!isActive ? 'kích hoạt' : 'vô hiệu hóa'} khung giờ`,
        life: 3000
      });
    } catch (err) {
      console.error("Error updating timeslot:", err);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể cập nhật trạng thái khung giờ',
        life: 3000
      });
    }
  };

  return (
    <Container fluid>
      <Toast ref={toast} />
      <h2 className="my-4">Quản lý khung giờ đặt lịch</h2>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Tạo khung giờ cho ngày cụ thể</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Chọn ngày</Form.Label>
                  <Calendar
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.value)}
                    dateFormat="dd/mm/yy"
                    showIcon
                    minDate={new Date()}
                    className="w-100"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Chọn khung giờ</Form.Label>
                  <MultiSelect
                    value={selectedTimes}
                    options={timeOptions}
                    onChange={(e) => setSelectedTimes(e.value)}
                    placeholder="Chọn khung giờ"
                    className="w-100"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng slot tối đa</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="20"
                    value={maxSlots}
                    onChange={(e) => setMaxSlots(parseInt(e.target.value))}
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  onClick={createTimeslotForDate}
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Tạo khung giờ'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4">
            <Card.Header>Tạo khung giờ cho khoảng thời gian</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Chọn khoảng thời gian</Form.Label>
                  <Calendar
                    value={dateRange}
                    onChange={(e) => setDateRange(e.value)}
                    selectionMode="range"
                    dateFormat="dd/mm/yy"
                    showIcon
                    minDate={new Date()}
                    className="w-100"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Chọn khung giờ (để trống để sử dụng tất cả)</Form.Label>
                  <MultiSelect
                    value={selectedTimes}
                    options={timeOptions}
                    onChange={(e) => setSelectedTimes(e.value)}
                    placeholder="Chọn khung giờ"
                    className="w-100"
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Số lượng slot tối đa</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="20"
                    value={maxSlots}
                    onChange={(e) => setMaxSlots(parseInt(e.target.value))}
                  />
                </Form.Group>
                
                <Button 
                  variant="success" 
                  onClick={createTimeslotsForRange}
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Tạo khung giờ cho khoảng thời gian'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {selectedDate && (
        <Card className="mt-4">
          <Card.Header>
            Danh sách khung giờ cho ngày {selectedDate.toLocaleDateString('vi-VN')}
          </Card.Header>
          <Card.Body>
            {loading ? (
              <div className="text-center">Đang tải...</div>
            ) : slots.length === 0 ? (
              <div className="text-center">Không có khung giờ nào cho ngày này</div>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Thời gian</th>
                    <th>Số lượng slot tối đa</th>
                    <th>Số lượng slot còn lại</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot) => (
                    <tr key={slot._id}>
                      <td>{slot.time}</td>
                      <td>{slot.maxSlots}</td>
                      <td>
                        <Badge bg={slot.availableSlots > 0 ? 'success' : 'danger'}>
                          {slot.availableSlots}/{slot.maxSlots}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={slot.isActive ? 'success' : 'secondary'}>
                          {slot.isActive ? 'Đang hoạt động' : 'Đã vô hiệu hóa'}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant={slot.isActive ? 'outline-danger' : 'outline-success'}
                          size="sm"
                          onClick={() => updateTimeslotStatus(slot._id, slot.isActive)}
                        >
                          {slot.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default TimeslotManagement;
