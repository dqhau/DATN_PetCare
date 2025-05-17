import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Form, InputGroup, Alert } from 'react-bootstrap';
import axios from 'axios';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all'); // all, pending, processing, completed, cancel
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewBooking, setViewBooking] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showChangeTimeslotDialog, setShowChangeTimeslotDialog] = useState(false);
  const [availableTimeslots, setAvailableTimeslots] = useState([]);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [error, setError] = useState(null);
  const toast = useRef(null);
  
  const statusOptions = [
    { label: 'Tất cả', value: 'all' },
    { label: 'Chờ xử lý', value: 'Pending' },
    { label: 'Đang xử lý', value: 'Processing' },
    { label: 'Hoàn thành', value: 'Completed' },
    { label: 'Đã hủy', value: 'Cancel' }
  ];
  
  // Lấy danh sách đặt lịch
  const fetchBookings = async () => {
    setLoading(true);
    try {
      console.log('Fetching bookings...');
      const response = await axios.get('http://localhost:9999/booking', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        // Thêm timestamp để tránh cache
        params: { timestamp: new Date().getTime() }
      });
      console.log('Bookings fetched:', response.data);
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
  
  // Cập nhật trạng thái đặt lịch
  const handleUpdateStatus = async (id, status) => {
    try {
      // Hiển thị loading
      setLoading(true);
      
      // Nếu hủy đặt lịch, thêm lý do hủy
      let updateData = { order_status: status };
      
      if (status === 'Cancel') {
        // Thêm lý do hủy mặc định hoặc có thể hiển thị dialog yêu cầu nhập lý do
        updateData.cancel_reason = "Hủy bởi quản trị viên";
      }
      
      console.log(`Updating booking ${id} status to ${status}...`);
      
      // Gọi API cập nhật trạng thái
      const response = await axios.put(`http://localhost:9999/booking/status/${id}`, 
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      
      console.log('Update response:', response.data);
      
      // Cập nhật trực tiếp vào state để tránh gọi lại API
      setBookings(prevBookings => {
        return prevBookings.map(booking => {
          if (booking._id === id) {
            const updatedBooking = {
              ...booking,
              order_status: status
            };
            if (status === 'Cancel') {
              updatedBooking.cancel_reason = updateData.cancel_reason;
            }
            return updatedBooking;
          }
          return booking;
        });
      });
      
      // Hiển thị thông báo thành công
      if (toast.current) {
        toast.current.show({ 
          severity: 'success', 
          summary: 'Thành công', 
          detail: `Đã cập nhật trạng thái thành ${getStatusText(status)}`, 
          life: 3000 
        });
      }
      
      // Gọi lại fetchBookings để đảm bảo dữ liệu được cập nhật từ server
      setTimeout(() => {
        fetchBookings();
      }, 500);
      
      // Nếu đang xem chi tiết, cập nhật thông tin
      if (viewBooking && viewBooking._id === id) {
        const updatedBooking = {...viewBooking, order_status: status};
        if (status === 'Cancel') {
          updatedBooking.cancel_reason = updateData.cancel_reason;
        }
        setViewBooking(updatedBooking);
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: error.response?.data?.error || 'Không thể cập nhật trạng thái', life: 3000 });
      }
    } finally {
      // Tắt loading
      setLoading(false);
    }
  };
  
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
  
  // Lấy danh sách timeslot theo ngày
  const fetchTimeslotsByDate = async (date) => {
    try {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const response = await axios.get(`http://localhost:9999/timeslots?date=${formattedDate}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      // Chỉ lấy các timeslot còn chỗ trống
      const availableSlots = response.data.filter(slot => slot.availableSlots > 0);
      setAvailableTimeslots(availableSlots);
    } catch (error) {
      console.error('Error fetching timeslots:', error);
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lấy danh sách khung giờ', life: 3000 });
      }
    }
  };

  // Chuyển đổi timeslot
  const handleChangeTimeslot = async () => {
    if (!selectedTimeslot || !selectedBookingId) {
      if (toast.current) {
        toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Vui lòng chọn khung giờ mới', life: 3000 });
      }
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:9999/booking/change-timeslot/${selectedBookingId}`,
        { newTimeslotId: selectedTimeslot },
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
          detail: 'Chuyển đổi khung giờ thành công', 
          life: 3000 
        });
      }

      // Đóng dialog và làm mới dữ liệu
      setShowChangeTimeslotDialog(false);
      setSelectedTimeslot(null);
      setSelectedBookingId(null);
      fetchBookings();

      // Nếu đang xem chi tiết, cập nhật thông tin
      if (viewBooking && viewBooking._id === selectedBookingId) {
        handleViewBooking(selectedBookingId);
      }
    } catch (error) {
      console.error('Error changing timeslot:', error);
      if (toast.current) {
        toast.current.show({ 
          severity: 'error', 
          summary: 'Lỗi', 
          detail: error.response?.data?.error || 'Không thể chuyển đổi khung giờ', 
          life: 3000 
        });
      }
    }
  };

  // Mở dialog chuyển đổi timeslot
  const openChangeTimeslotDialog = (bookingId, date) => {
    setSelectedBookingId(bookingId);
    setSelectedDate(new Date(date));
    fetchTimeslotsByDate(date);
    setShowChangeTimeslotDialog(true);
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
    
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.customer_name?.toLowerCase().includes(searchLower) ||
        booking.phone_number?.toLowerCase().includes(searchLower) ||
        booking.email?.toLowerCase().includes(searchLower) ||
        (booking.petId?.name && booking.petId.name.toLowerCase().includes(searchLower)) ||
        booking._id.toLowerCase().includes(searchLower)
      );
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
              <>
                <Button 
                  variant="info" 
                  className="ms-2"
                  onClick={() => handleUpdateStatus(viewBooking._id, 'Processing')}
                >
                  Xác nhận
                </Button>
                <Button 
                  variant="danger" 
                  className="ms-2"
                  onClick={() => handleUpdateStatus(viewBooking._id, 'Cancel')}
                >
                  Từ chối
                </Button>
              </>
            )}
            {viewBooking.order_status === 'Processing' && (
              <Button 
                variant="success" 
                className="ms-2"
                onClick={() => handleUpdateStatus(viewBooking._id, 'Completed')}
              >
                Hoàn thành
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
                    <td>{viewBooking.petId?.name || 'Không có thông tin'}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Loài:</td>
                    <td>{viewBooking.petId?.species || 'Không có thông tin'}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Giống:</td>
                    <td>{viewBooking.petId?.breed || 'Không có thông tin'}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Tuổi:</td>
                    <td>{viewBooking.petId?.age ? `${viewBooking.petId.age} tuổi` : 'Không có thông tin'}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Cân nặng:</td>
                    <td>{viewBooking.petId?.weight ? `${viewBooking.petId.weight} kg` : 'Không có thông tin'}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">Ghi chú:</td>
                    <td>{viewBooking.petId?.notes || 'Không có'}</td>
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
  
  return (
    <Container fluid>
      <Toast ref={toast} />
      <h2 className="mb-4">Quản lý đặt lịch</h2>
      
      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={3}>
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
            <Col md={3}>
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Tìm kiếm</Form.Label>
                <InputGroup>
                  <Form.Control
                    placeholder="Tìm theo tên, số điện thoại, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => setSearchTerm('')}
                    >
                      Xóa
                    </Button>
                  )}
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end mb-3">
              <Button 
                variant="outline-secondary" 
                className="w-100"
                onClick={() => {
                  setFilter('all');
                  setSelectedDate(null);
                  setSearchTerm('');
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
                onClick={fetchBookings}
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
                              <>
                                <Button 
                                  variant="outline-success" 
                                  size="sm"
                                  onClick={() => handleUpdateStatus(booking._id, 'Processing')}
                                >
                                  Xác nhận
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleUpdateStatus(booking._id, 'Cancel')}
                                >
                                  Từ chối
                                </Button>
                              </>
                            )}
                            
                            {booking.order_status === 'Processing' && (
                              <>
                                <Button 
                                  variant="outline-success" 
                                  size="sm"
                                  onClick={() => handleUpdateStatus(booking._id, 'Completed')}
                                >
                                  Hoàn thành
                                </Button>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => openChangeTimeslotDialog(booking._id, booking.appointment_date)}
                                >
                                  Đổi giờ
                                </Button>
                              </>
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
      
      {/* Dialog chuyển đổi timeslot */}
      <Dialog
        header="Chuyển đổi khung giờ"
        visible={showChangeTimeslotDialog}
        style={{ width: '50vw' }}
        onHide={() => setShowChangeTimeslotDialog(false)}
        footer={
          <div>
            <Button 
              variant="primary" 
              onClick={handleChangeTimeslot}
              disabled={!selectedTimeslot}
            >
              Xác nhận
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setShowChangeTimeslotDialog(false)}
              className="ml-2"
            >
              Hủy
            </Button>
          </div>
        }
      >
        <div className="p-3">
          <h5>Chọn khung giờ mới:</h5>
          
          <div className="mb-3">
            <Calendar
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.value);
                fetchTimeslotsByDate(e.value);
              }}
              dateFormat="dd/mm/yy"
              placeholder="Chọn ngày"
              className="w-100"
            />
          </div>
          
          {availableTimeslots.length === 0 ? (
            <Alert variant="info">
              Không có khung giờ trống cho ngày này. Vui lòng chọn ngày khác.
            </Alert>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {availableTimeslots.map((slot) => (
                <Button
                  key={slot._id}
                  variant={selectedTimeslot === slot._id ? "primary" : "outline-primary"}
                  onClick={() => setSelectedTimeslot(slot._id)}
                  className="mb-2"
                >
                  {slot.time}:00 ({slot.availableSlots}/{slot.maxSlots})
                </Button>
              ))}
            </div>
          )}
        </div>
      </Dialog>
    </Container>
  );
};

export default BookingManagement;
