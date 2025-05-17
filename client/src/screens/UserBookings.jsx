import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, InputGroup, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, processing, completed, cancel
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewBooking, setViewBooking] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [error, setError] = useState(null);
  const toast = useRef(null);
  const navigate = useNavigate();
  
  const statusOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Chờ xử lý', value: 'Pending' },
    { label: 'Đang xử lý', value: 'Processing' },
    { label: 'Hoàn thành', value: 'Completed' },
    { label: 'Đã hủy', value: 'Cancel' }
  ];
  
  const userId = localStorage.getItem('userId');
  
  // Lấy danh sách đặt lịch của người dùng
  const fetchUserBookings = async () => {
    if (!userId) {
      navigate('/login');
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:9999/booking/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setBookings(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      setError('Không thể lấy danh sách đặt lịch. Vui lòng thử lại sau.');
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lấy danh sách đặt lịch', life: 3000 });
      }
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUserBookings();
  }, [userId]);
  
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
  
  // Hủy đặt lịch
  const handleCancelBooking = async () => {
    if (!viewBooking) return;
    
    try {
      await axios.put(`http://localhost:9999/booking/status/${viewBooking._id}`, 
        { 
          order_status: 'Cancel',
          cancel_reason: cancelReason
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      
      if (toast.current) {
        toast.current.show({ 
          severity: 'success', 
          summary: 'Thành công', 
          detail: 'Đã hủy đặt lịch thành công', 
          life: 3000 
        });
      }
      
      setShowCancelDialog(false);
      setShowViewDialog(false);
      setCancelReason('');
      fetchUserBookings();
      
    } catch (error) {
      console.error('Error canceling booking:', error);
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể hủy đặt lịch', life: 3000 });
      }
    }
  };
  
  // Lọc đặt lịch
  const filteredBookings = bookings.filter(booking => {
    // Lọc theo trạng thái
    if (filter !== 'all' && booking.order_status !== filter) {
      return false;
    }
    
    // Lọc theo ngày
    if (selectedDate) {
      const bookingDate = new Date(booking.appointment_date);
      const filterDate = new Date(selectedDate);
      
      if (
        bookingDate.getDate() !== filterDate.getDate() ||
        bookingDate.getMonth() !== filterDate.getMonth() ||
        bookingDate.getFullYear() !== filterDate.getFullYear()
      ) {
        return false;
      }
    }
    
    return true;
  });
  
  // Hiển thị badge theo trạng thái
  const getStatusBadge = (status) => {
    switch(status) {
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
    switch(status) {
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
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        footer={
          <div>
            <Button 
              variant="secondary" 
              onClick={() => setShowViewDialog(false)}
            >
              Đóng
            </Button>
            {viewBooking.order_status === 'Pending' && (
              <Button 
                variant="danger" 
                className="ms-2"
                onClick={() => setShowCancelDialog(true)}
              >
                Hủy đặt lịch
              </Button>
            )}
          </div>
        }
      >
        <div className="p-3">
          <Row>
            <Col md={6}>
              <h5>Thông tin khách hàng</h5>
              <Table bordered>
                <tbody>
                  <tr>
                    <td className="fw-bold">Họ tên:</td>
                    <td>{viewBooking.customer_name}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Số điện thoại:</td>
                    <td>{viewBooking.phone_number}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Email:</td>
                    <td>{viewBooking.email}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Địa chỉ:</td>
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
                    <td className="fw-bold">Tên thú cưng:</td>
                    <td>{viewBooking.pet_info?.pet_name}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Loài:</td>
                    <td>{viewBooking.pet_info?.species}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Giống:</td>
                    <td>{viewBooking.pet_info?.breed}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Tuổi:</td>
                    <td>{viewBooking.pet_info?.age} tuổi</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Cân nặng:</td>
                    <td>{viewBooking.pet_info?.weight} kg</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Ghi chú:</td>
                    <td>{viewBooking.pet_info?.notes || 'Không có'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          
          <Row className="mt-3">
            <Col md={6}>
              <h5>Thông tin đặt lịch</h5>
              <Table bordered>
                <tbody>
                  <tr>
                    <td className="fw-bold">Mã đặt lịch:</td>
                    <td>{viewBooking._id}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Dịch vụ:</td>
                    <td>{viewBooking.service_type?.name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Giá:</td>
                    <td>{viewBooking.service_type?.price?.toLocaleString('vi-VN')} VNĐ</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Ngày hẹn:</td>
                    <td>{formatDate(viewBooking.appointment_date)}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Giờ hẹn:</td>
                    <td>{viewBooking.timeslot ? `${viewBooking.timeslot.time}:00` : 'N/A'}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Trạng thái:</td>
                    <td>{getStatusBadge(viewBooking.order_status)}</td>
                  </tr>
                  {viewBooking.order_status === 'Cancel' && (
                    <tr>
                      <td className="fw-bold">Lý do hủy:</td>
                      <td>{viewBooking.cancel_reason || 'Không có'}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <h5>Mô tả yêu cầu</h5>
              <div className="border p-3 rounded" style={{ minHeight: '150px' }}>
                {viewBooking.description || 'Không có mô tả'}
              </div>
            </Col>
          </Row>
        </div>
      </Dialog>
    );
  };
  
  // Dialog xác nhận hủy đặt lịch
  const renderCancelDialog = () => {
    return (
      <Dialog
        header="Xác nhận hủy đặt lịch"
        visible={showCancelDialog}
        style={{ width: '30vw' }}
        onHide={() => setShowCancelDialog(false)}
        footer={
          <div>
            <Button
              variant="secondary"
              onClick={() => setShowCancelDialog(false)}
            >
              Đóng
            </Button>
            <Button
              variant="danger"
              className="ms-2"
              onClick={handleCancelBooking}
              disabled={!cancelReason.trim()}
            >
              Xác nhận hủy
            </Button>
          </div>
        }
      >
        <div className="p-3">
          <p>Bạn có chắc chắn muốn hủy đặt lịch này không?</p>
          <Form.Group controlId="cancelReason">
            <Form.Label>Lý do hủy <span className="text-danger">*</span></Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Vui lòng nhập lý do hủy đặt lịch..."
              required
            />
            {!cancelReason.trim() && (
              <Form.Text className="text-danger">
                Vui lòng nhập lý do hủy đặt lịch
              </Form.Text>
            )}
          </Form.Group>
        </div>
      </Dialog>
    );
  };
  
  return (
    <Container fluid className="py-4">
      <Toast ref={toast} />
      <h2 className="mb-4">Lịch sử đặt lịch</h2>
      
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Lọc theo trạng thái</Form.Label>
                <Dropdown
                  value={filter}
                  options={statusOptions}
                  onChange={(e) => setFilter(e.value)}
                  placeholder="Chọn trạng thái"
                  className="w-100"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Lọc theo ngày</Form.Label>
                <Calendar
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.value)}
                  dateFormat="dd/mm/yy"
                  showIcon
                  className="w-100"
                />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end mb-3">
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={() => {
                  setFilter('all');
                  setSelectedDate(null);
                }}
              >
                Xóa bộ lọc
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Danh sách đặt lịch</h5>
            <div>
              <span className="me-2">
                Tổng số: <Badge bg="primary">{filteredBookings.length}</Badge>
              </span>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={fetchUserBookings}
                disabled={loading}
              >
                <i className="pi pi-refresh me-2"></i>
                Làm mới
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
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
                      <th>Mã đặt lịch</th>
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
                        <td>{booking.service_type?.name || 'N/A'}</td>
                        <td>
                          <div>{booking.pet_info?.pet_name || 'N/A'}</div>
                          <small className="text-muted">{booking.pet_info?.species}, {booking.pet_info?.breed}</small>
                        </td>
                        <td>{new Date(booking.appointment_date).toLocaleDateString()}</td>
                        <td>{booking.timeslot ? `${booking.timeslot.time}:00` : 'N/A'}</td>
                        <td>{getStatusBadge(booking.order_status)}</td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button 
                              variant="outline-info" 
                              size="sm"
                              onClick={() => handleViewBooking(booking._id)}
                            >
                              Chi tiết
                            </Button>
                            
                            {booking.order_status === 'Pending' && (
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => {
                                  setViewBooking(booking);
                                  setShowCancelDialog(true);
                                }}
                              >
                                Hủy
                              </Button>
                            )}
                          </div>
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
      {renderCancelDialog()}
    </Container>
  );
};

export default UserBookings;
