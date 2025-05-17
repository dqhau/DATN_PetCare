import React, { useState } from 'react';
import { Button, Form, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

const DEFAULT_TIMES = [
  "8:00", "9:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const AutoGenerateTimeSlots = ({ onSuccess }) => {
  const [startDate, setStartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [days, setDays] = useState(10);
  const [timeSlots, setTimeSlots] = useState([...DEFAULT_TIMES]);
  const [maxSlots, setMaxSlots] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTimeChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setTimeSlots(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!startDate || days < 1 || timeSlots.length === 0 || maxSlots < 1) {
      setError('Vui lòng nhập đầy đủ thông tin hợp lệ.');
      return;
    }
    setLoading(true);
    try {
      const fromDate = new Date(startDate);
      const toDate = new Date(fromDate);
      toDate.setDate(fromDate.getDate() + days - 1);
      const token = localStorage.getItem('accessToken');
      await axios.post('http://localhost:9999/timeslots/generate-for-range', {
        startDate: startDate,
        endDate: toDate.toISOString().split('T')[0],
        timeSlots,
        maxSlots,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (onSuccess) onSuccess();
      alert('Đã tạo timeslot tự động thành công!');
    } catch (err) {
      setError('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="border p-3 rounded bg-light">
      <Row>
        <Col md={3}>
          <Form.Group controlId="startDate">
            <Form.Label>Bắt đầu từ ngày</Form.Label>
            <Form.Control type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="days">
            <Form.Label>Số ngày</Form.Label>
            <Form.Control type="number" min={1} max={30} value={days} onChange={e => setDays(Number(e.target.value))} />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group controlId="timeSlots">
            <Form.Label>Chọn khung giờ</Form.Label>
            <Form.Control as="select" multiple value={timeSlots} onChange={handleTimeChange}>
              {DEFAULT_TIMES.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </Form.Control>
            <Form.Text className="text-muted">Giữ Ctrl để chọn nhiều khung giờ</Form.Text>
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group controlId="maxSlots">
            <Form.Label>Số slot/khung</Form.Label>
            <Form.Control type="number" min={1} max={20} value={maxSlots} onChange={e => setMaxSlots(Number(e.target.value))} />
          </Form.Group>
        </Col>
        <Col md={1} className="d-flex align-items-end">
          <Button type="submit" variant="primary" disabled={loading} className="w-100">
            {loading ? <Spinner size="sm" animation="border" /> : 'Tạo'}
          </Button>
        </Col>
      </Row>
      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
    </Form>
  );
};

export default AutoGenerateTimeSlots;
