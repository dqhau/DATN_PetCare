import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, InputGroup, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('Completed'); // Mặc định hiển thị các đơn đã hoàn thành
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewBooking, setViewBooking] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [error, setError] = useState(null);
  const toast = useRef(null);
  
  const statusOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Hoàn thành', value: 'Completed' },
    { label: 'Đã hủy', value: 'Cancel' }
  ];
  
  // Lấy danh sách đặt lịch
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:9999/booking', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setBookings(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Không thể lấy danh sách đặt lịch. Vui lòng thử lại sau.');
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lấy danh sách đặt lịch', life: 3000 });
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, []);
  
  // Xem chi tiết đặt lịch
  const handleViewBooking = async (id) => {
    try {
      const response = await axios.get(`http://localhost:9999/booking/detail/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setViewBooking(response.data);
      setShowViewDialog(true);
    } catch (error) {
      console.error('Error fetching booking details:', error);
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lấy chi tiết đặt lịch', life: 3000 });
      }
    }
  };
  
  // Lọc đặt lịch
  const filteredBookings = bookings.filter(booking => {
    // Lọc theo trạng thái
    if (filter !== 'all' && booking.order_status !== filter) {
      return false;
    }
    
    // Lọc theo khoảng thời gian
    if (startDate && endDate) {
      const bookingDate = new Date(booking.appointment_date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Đặt thời gian kết thúc là cuối ngày
      
      if (bookingDate < start || bookingDate > end) {
        return false;
      }
    } else if (startDate) {
      const bookingDate = new Date(booking.appointment_date);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0); // Đặt thời gian bắt đầu là đầu ngày
      
      if (bookingDate < start) {
        return false;
      }
    } else if (endDate) {
      const bookingDate = new Date(booking.appointment_date);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Đặt thời gian kết thúc là cuối ngày
      
      if (bookingDate > end) {
        return false;
      }
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.customer_name?.toLowerCase().includes(searchLower) ||
        booking.phone_number?.includes(searchTerm) ||
        booking.pet_info?.pet_name?.toLowerCase().includes(searchLower) ||
        booking.service_type?.name?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Hiển thị badge theo trạng thái
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <Badge bg="warning">Chờ xử lý</Badge>;
      case 'Processing':
        return <Badge bg="info">Đang xử lý</Badge>;
      case 'Completed':
        return <Badge bg="success">Hoàn thành</Badge>;
      case 'Cancel':
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };
  
  // Lấy text trạng thái
  const getStatusText = (status) => {
    switch (status) {
      case 'Pending': return 'Chờ xử lý';
      case 'Processing': return 'Đang xử lý';
      case 'Completed': return 'Hoàn thành';
      case 'Cancel': return 'Đã hủy';
      default: return status;
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Nội dung dialog xem chi tiết
  const renderViewDialog = () => {
    if (!viewBooking) return null;
    
    return (
      <Dialog
        header="Chi tiết đặt lịch"
        visible={showViewDialog}
        style={{ width: '70vw' }}
        onHide={() => setShowViewDialog(false)}
      >
        <div className="p-3">
          <Row>
            <Col md={6}>
              <h5>Thông tin khách hàng</h5>
              <Table bordered>
                <tbody>
                  <tr>
                    <td className="fw-bold">Họ tên</td>
                    <td>{viewBooking.customer_name}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Số điện thoại</td>
                    <td>{viewBooking.phone_number}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Email</td>
                    <td>{viewBooking.email}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Địa chỉ</td>
                    <td>{viewBooking.address}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            
            <Col md={6}>
              <h5>Thông tin thú cưng</h5>
              <Table bordered>
                <tbody>
                  <tr>
                    <td className="fw-bold">Tên thú cưng</td>
                    <td>{viewBooking.pet_info?.pet_name}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Loài</td>
                    <td>{viewBooking.pet_info?.species}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Giống</td>
                    <td>{viewBooking.pet_info?.breed}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Tuổi</td>
                    <td>{viewBooking.pet_info?.age} tuổi</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Cân nặng</td>
                    <td>{viewBooking.pet_info?.weight} kg</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Ghi chú</td>
                    <td>{viewBooking.pet_info?.notes || 'Không có'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          
          <Row className="mt-3">
            <Col md={12}>
              <h5>Thông tin đặt lịch</h5>
              <Table bordered>
                <tbody>
                  <tr>
                    <td className="fw-bold">Mã đặt lịch</td>
                    <td>{viewBooking._id}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Dịch vụ</td>
                    <td>{viewBooking.service_type?.name}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Giá</td>
                    <td>{viewBooking.service_type?.price?.toLocaleString('vi-VN')} đ</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Ngày hẹn</td>
                    <td>{formatDate(viewBooking.appointment_date)}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Giờ hẹn</td>
                    <td>{viewBooking.timeslot?.time} giờ</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Trạng thái</td>
                    <td>{getStatusBadge(viewBooking.order_status)}</td>
                  </tr>
                  {viewBooking.order_status === 'Cancel' && (
                    <tr>
                      <td className="fw-bold">Lý do hủy</td>
                      <td>{viewBooking.cancel_reason || 'Không có lý do'}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </div>
      </Dialog>
    );
  };
  
  return (
    <Container fluid className="p-3">
      <Toast ref={toast} />
      
      <Card>
        <Card.Header>
          <h4>Lịch sử đặt lịch</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Trạng thái</Form.Label>
                <Dropdown
                  value={filter}
                  options={statusOptions}
                  onChange={(e) => setFilter(e.value)}
                  placeholder="Chọn trạng thái"
                  className="w-100"
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>Từ ngày</Form.Label>
                <Calendar
                  value={startDate}
                  onChange={(e) => setStartDate(e.value)}
                  dateFormat="dd/mm/yy"
                  placeholder="Chọn ngày bắt đầu"
                  className="w-100"
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>Đến ngày</Form.Label>
                <Calendar
                  value={endDate}
                  onChange={(e) => setEndDate(e.value)}
                  dateFormat="dd/mm/yy"
                  placeholder="Chọn ngày kết thúc"
                  className="w-100"
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group>
                <Form.Label>Tìm kiếm</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Tìm theo tên, SĐT, thú cưng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
                    Xóa
                  </Button>
                </InputGroup>
              </Form.Group>
            </Col>
          </Row>
          
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}
          
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : (
            <>
              {filteredBookings.length === 0 ? (
                <Alert variant="info">
                  Không tìm thấy đặt lịch nào phù hợp với bộ lọc hiện tại.
                </Alert>
              ) : (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Khách hàng</th>
                      <th>Dịch vụ</th>
                      <th>Thú cưng</th>
                      <th>Ngày hẹn</th>
                      <th>Giờ</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id}>
                        <td>{booking._id.substring(0, 8)}...</td>
                        <td>
                          <div>{booking.customer_name}</div>
                          <small className="text-muted">{booking.phone_number}</small>
                        </td>
                        <td>{booking.service_type?.name || 'N/A'}</td>
                        <td>
                          <div>{booking.pet_info?.pet_name || 'N/A'}</div>
                          <small className="text-muted">{booking.pet_info?.species}, {booking.pet_info?.breed}</small>
                        </td>
                        <td>{new Date(booking.appointment_date).toLocaleDateString()}</td>
                        <td>{booking.timeslot?.time || 'N/A'}</td>
                        <td>{getStatusBadge(booking.order_status)}</td>
                        <td>
                          <Button 
                            variant="outline-info" 
                            size="sm"
                            onClick={() => handleViewBooking(booking._id)}
                          >
                            Chi tiết
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </Card.Body>
      </Card>
      
      {renderViewDialog()}
    </Container>
  );
};

export default BookingHistory;
