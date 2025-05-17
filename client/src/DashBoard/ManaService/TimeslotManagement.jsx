import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Alert, Tabs, Tab } from 'react-bootstrap';
import { PenFill, Trash, PlusCircle } from 'react-bootstrap-icons';
import axios from 'axios';

const TimeslotManagement = () => {
  // State cho quản lý khung giờ cố định
  const [timeslots, setTimeslots] = useState([]);
  const [newTimeslot, setNewTimeslot] = useState({ start_time: '', end_time: '', max_slots: 5 });
  
  // State cho quản lý tính khả dụng
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  
  // State cho tạo tính khả dụng hàng loạt
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedTimeslots, setSelectedTimeslots] = useState([]);
  const [excludeDays, setExcludeDays] = useState([0]); // Mặc định loại trừ Chủ nhật (0)
  
  // State chung
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Lấy danh sách khung giờ cố định
  const fetchTimeslots = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:9999/api/timeslots');
      setTimeslots(response.data);
      setLoading(false);
    } catch (err) {
      setError('Không thể lấy danh sách khung giờ');
      setLoading(false);
    }
  };
  
  // Lấy danh sách tính khả dụng theo ngày
  const fetchAvailabilities = async (date) => {
    if (!date) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:9999/api/availability/${date}`);
      setAvailabilities(response.data);
      setLoading(false);
    } catch (err) {
      setError('Không thể lấy danh sách tính khả dụng');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTimeslots();
  }, []);
  
  useEffect(() => {
    if (selectedDate) {
      fetchAvailabilities(selectedDate);
    }
  }, [selectedDate]);
  
  // Tạo khung giờ mới
  const handleCreateTimeslot = async (e) => {
    e.preventDefault();
    
    if (!newTimeslot.start_time || !newTimeslot.end_time || !newTimeslot.max_slots) {
      setError('Vui lòng nhập đầy đủ thông tin khung giờ');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      await axios.post('http://localhost:9999/api/timeslots', newTimeslot, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Đã tạo khung giờ mới thành công');
      setNewTimeslot({ start_time: '', end_time: '', max_slots: 5 });
      fetchTimeslots();
      setLoading(false);
    } catch (err) {
      setError('Không thể tạo khung giờ mới');
      setLoading(false);
    }
  };
  
  // Xóa khung giờ
  const handleDeleteTimeslot = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa khung giờ này?')) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      await axios.delete(`http://localhost:9999/api/timeslots/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Đã xóa khung giờ thành công');
      fetchTimeslots();
      setLoading(false);
    } catch (err) {
      setError('Không thể xóa khung giờ');
      setLoading(false);
    }
  };
  
  // Tạo tính khả dụng hàng loạt
  const handleGenerateAvailability = async (e) => {
    e.preventDefault();
    
    if (!startDate || !endDate || selectedTimeslots.length === 0) {
      setError('Vui lòng chọn khoảng thời gian và khung giờ');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      
      await axios.post('http://localhost:9999/api/availability/generate', {
        start_date: startDate,
        end_date: endDate,
        timeslot_ids: selectedTimeslots,
        exclude_days: excludeDays
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSuccess('Đã tạo tính khả dụng thành công');
      if (selectedDate) {
        fetchAvailabilities(selectedDate);
      }
      setLoading(false);
    } catch (err) {
      setError('Không thể tạo tính khả dụng');
      setLoading(false);
    }
  };
  
  // Xử lý chọn/bỏ chọn ngày loại trừ
  const handleExcludeDayChange = (day) => {
    if (excludeDays.includes(day)) {
      setExcludeDays(excludeDays.filter(d => d !== day));
    } else {
      setExcludeDays([...excludeDays, day]);
    }
  };
  
  // Xử lý chọn/bỏ chọn khung giờ
  const handleTimeslotSelection = (id) => {
    if (selectedTimeslots.includes(id)) {
      setSelectedTimeslots(selectedTimeslots.filter(t => t !== id));
    } else {
      setSelectedTimeslots([...selectedTimeslots, id]);
    }
  };
  
  return (
    <Container fluid>
      <h2 className="my-4">Quản lý khung giờ đặt lịch</h2>
      
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
      
      <Tabs defaultActiveKey="timeslots" id="timeslot-management-tabs" className="mb-3">
        <Tab eventKey="timeslots" title="Khung giờ cố định">
          <Row>
            <Col md={4}>
              <Card className="mb-4">
                <Card.Header>Tạo khung giờ mới</Card.Header>
                <Card.Body>
                  <Form onSubmit={handleCreateTimeslot}>
                    <Form.Group className="mb-3">
                      <Form.Label>Thời gian bắt đầu</Form.Label>
                      <Form.Control 
                        type="time" 
                        value={newTimeslot.start_time}
                        onChange={(e) => setNewTimeslot({...newTimeslot, start_time: e.target.value})}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Thời gian kết thúc</Form.Label>
                      <Form.Control 
                        type="time" 
                        value={newTimeslot.end_time}
                        onChange={(e) => setNewTimeslot({...newTimeslot, end_time: e.target.value})}
                        required
                      />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Số slot tối đa</Form.Label>
                      <Form.Control 
                        type="number" 
                        min="1"
                        value={newTimeslot.max_slots}
                        onChange={(e) => setNewTimeslot({...newTimeslot, max_slots: parseInt(e.target.value)})}
                        required
                      />
                    </Form.Group>
                    
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Đang xử lý...' : 'Tạo khung giờ'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={8}>
              <Card>
                <Card.Header>Danh sách khung giờ cố định</Card.Header>
                <Card.Body>
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Bắt đầu</th>
                        <th>Kết thúc</th>
                        <th>Slot tối đa</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeslots.map((timeslot, index) => (
                        <tr key={timeslot.id}>
                          <td>{index + 1}</td>
                          <td>{timeslot.start_time}</td>
                          <td>{timeslot.end_time}</td>
                          <td>{timeslot.max_slots}</td>
                          <td>
                            <span className={`badge ${timeslot.is_active ? 'bg-success' : 'bg-danger'}`}>
                              {timeslot.is_active ? 'Hoạt động' : 'Vô hiệu'}
                            </span>
                          </td>
                          <td>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => handleDeleteTimeslot(timeslot.id)}
                              disabled={loading}
                            >
                              <Trash />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {timeslots.length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center">Không có khung giờ nào</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
        
        <Tab eventKey="availability" title="Tính khả dụng theo ngày">
          <Row>
            <Col md={12} className="mb-4">
              <Card>
                <Card.Header>Tạo tính khả dụng hàng loạt</Card.Header>
                <Card.Body>
                  <Form onSubmit={handleGenerateAvailability}>
                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Ngày bắt đầu</Form.Label>
                          <Form.Control 
                            type="date" 
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Ngày kết thúc</Form.Label>
                          <Form.Control 
                            type="date" 
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                          />
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Loại trừ ngày</Form.Label>
                          <div className="d-flex flex-wrap">
                            {[
                              { value: 0, label: 'CN' },
                              { value: 1, label: 'T2' },
                              { value: 2, label: 'T3' },
                              { value: 3, label: 'T4' },
                              { value: 4, label: 'T5' },
                              { value: 5, label: 'T6' },
                              { value: 6, label: 'T7' }
                            ].map(day => (
                              <Form.Check
                                key={day.value}
                                type="checkbox"
                                id={`exclude-day-${day.value}`}
                                label={day.label}
                                checked={excludeDays.includes(day.value)}
                                onChange={() => handleExcludeDayChange(day.value)}
                                className="me-3"
                              />
                            ))}
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>Chọn khung giờ</Form.Label>
                      <div className="d-flex flex-wrap">
                        {timeslots.map(timeslot => (
                          <Form.Check
                            key={timeslot.id}
                            type="checkbox"
                            id={`timeslot-${timeslot.id}`}
                            label={`${timeslot.start_time} - ${timeslot.end_time}`}
                            checked={selectedTimeslots.includes(timeslot.id)}
                            onChange={() => handleTimeslotSelection(timeslot.id)}
                            className="me-3 mb-2"
                          />
                        ))}
                      </div>
                    </Form.Group>
                    
                    <Button type="submit" variant="primary" disabled={loading}>
                      {loading ? 'Đang xử lý...' : 'Tạo tính khả dụng'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            
            <Col md={12}>
              <Card>
                <Card.Header>Xem tính khả dụng theo ngày</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Chọn ngày</Form.Label>
                    <Form.Control 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </Form.Group>
                  
                  {selectedDate && (
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Khung giờ</th>
                          <th>Slot khả dụng</th>
                          <th>Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availabilities.map((availability) => (
                          <tr key={availability._id}>
                            <td>
                              {availability.timeslot ? 
                                `${availability.timeslot.start_time} - ${availability.timeslot.end_time}` : 
                                availability.timeslot_id}
                            </td>
                            <td>{availability.available_slots}</td>
                            <td>
                              <span className={`badge ${availability.is_available ? 'bg-success' : 'bg-danger'}`}>
                                {availability.is_available ? 'Khả dụng' : 'Không khả dụng'}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {availabilities.length === 0 && (
                          <tr>
                            <td colSpan="3" className="text-center">Không có tính khả dụng nào cho ngày này</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default TimeslotManagement;
