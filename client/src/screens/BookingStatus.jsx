import React, { useState, useEffect } from "react";
import { Row, Col, Breadcrumb, Table, Badge, Button, Tabs, Tab, Modal, Form, Spinner, Dropdown } from "react-bootstrap";
import { FaEye, FaCalendarAlt, FaHistory, FaFilter, FaFilePdf } from "react-icons/fa";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from '../components/Header';
import '../style/booking.css';

const BookingStatus = () => {
  const [bookings, setBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [serviceCategories, setServiceCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPet, setSelectedPet] = useState("all");
  const [userPets, setUserPets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchBookings();
      fetchBookingHistory();
      fetchServiceCategories();
      fetchUserPets();
    }
  }, [userId]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để xem lịch chăm sóc');
      }

      const response = await axios.get(`http://localhost:9999/booking/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Lọc các booking chưa hoàn thành
      const activeBookings = Array.isArray(response.data) 
        ? response.data.filter(booking => booking.status !== "Completed")
        : [];
      setBookings(activeBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Không thể tải dữ liệu lịch chăm sóc. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };
  
  const fetchBookingHistory = async () => {
    if (activeTab === 'history') {
      setHistoryLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Bạn cần đăng nhập để xem lịch sử chăm sóc');
        }

        const response = await axios.get(`http://localhost:9999/booking/history/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Chỉ lấy các booking đã hoàn thành
        const completedBookings = Array.isArray(response.data) 
          ? response.data.filter(booking => booking.status === "Completed")
          : [];
        setBookingHistory(completedBookings);
      } catch (err) {
        console.error("Error fetching booking history:", err);
        toast.error("Không thể tải lịch sử chăm sóc. Vui lòng thử lại sau.");
      } finally {
        setHistoryLoading(false);
      }
    }
  };
  
  const fetchServiceCategories = async () => {
    try {
      const response = await axios.get('http://localhost:9999/service/categories');
      setServiceCategories(response.data);
    } catch (err) {
      console.error("Error fetching service categories:", err);
    }
  };
  
  const fetchUserPets = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để xem thú cưng');
      }

      const response = await axios.get(`http://localhost:9999/pet/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (Array.isArray(response.data)) {
        setUserPets(response.data);
      }
    } catch (err) {
      console.error("Error fetching user pets:", err);
    }
  };
  
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };
  
  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
  };
  
  const handlePetFilter = (petId) => {
    setSelectedPet(petId);
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleExportPDF = (bookingId) => {
    // Xử lý xuất PDF cho lịch sử chăm sóc
    toast.info("Tính năng xuất PDF đang được phát triển");
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
  };
  
  // Hiển thị trạng thái dưới dạng badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <Badge bg="warning">Chờ xác nhận</Badge>;
      case "Confirmed":
        return <Badge bg="info">Đã xác nhận</Badge>;
      case "Completed":
        return <Badge bg="success">Đã hoàn thành</Badge>;
      case "Canceled":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  // Lọc booking theo tab, trạng thái và thú cưng
  const filteredBookings = bookings.filter(booking => {
    // Lọc theo tab trạng thái
    const statusMatch = 
      (activeTab === "all") || 
      (activeTab === "pending" && booking.status === "Pending") ||
      (activeTab === "confirmed" && booking.status === "Confirmed") ||
      (activeTab === "canceled" && booking.status === "Canceled");
    
    // Lọc theo thú cưng
    const petMatch = selectedPet === "all" || 
      (booking.petId === selectedPet) ||
      (booking.pet && booking.pet._id === selectedPet);
    
    return statusMatch && petMatch;
  });
  
  // Lọc lịch sử theo danh mục, thú cưng và từ khóa tìm kiếm
  const filteredHistory = bookingHistory.filter(booking => {
    // Lọc theo danh mục dịch vụ
    const categoryMatch = selectedCategory === "all" || 
      (booking.service_type && booking.service_type.category === selectedCategory);
    
    // Lọc theo thú cưng
    const petMatch = selectedPet === "all" || 
      (booking.petId === selectedPet) ||
      (booking.pet && booking.pet._id === selectedPet);
    
    // Lọc theo từ khóa tìm kiếm
    const searchMatch = !searchTerm || 
      (booking.service_type && booking.service_type.name && booking.service_type.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.petName && booking.petName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.pet && booking.pet.name && booking.pet.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return categoryMatch && petMatch && searchMatch;
  });

  return (
    <div>
      <Header />
      <Row className="mt-4 mx-3">
        <Breadcrumb>
          <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item active>Lịch chăm sóc</Breadcrumb.Item>
        </Breadcrumb>
      </Row>

      <div className="container-fluid mt-4">
        <Tabs
          id="booking-tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="all" title="Tất cả">
            <div className="card mb-4 w-100">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0 d-flex align-items-center">
                  <FaCalendarAlt className="me-2 text-primary" /> Lịch chăm sóc
                </h5>
                <div className="d-flex gap-2">
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm" id="dropdown-pet-active">
                      <i className="fas fa-paw me-1"></i> {selectedPet === "all" ? "Tất cả thú cưng" : userPets.find(pet => pet._id === selectedPet)?.name || "Thú cưng"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handlePetFilter("all")}>Tất cả thú cưng</Dropdown.Item>
                      <Dropdown.Divider />
                      {userPets.map(pet => (
                        <Dropdown.Item key={pet._id} onClick={() => handlePetFilter(pet._id)}>
                          {pet.name} ({pet.species})
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <div className="card-body p-0">
                <div className="booking-tabs">
                  <ul className="nav nav-tabs">
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('all')}
                      >
                        Tất cả
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('pending')}
                      >
                        Chờ xác nhận
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'confirmed' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('confirmed')}
                      >
                        Đã xác nhận
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'canceled' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('canceled')}
                      >
                        Đã hủy
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'history' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('history')}
                      >
                        <FaHistory className="me-1" /> Lịch sử
                      </button>
                    </li>
                  </ul>
                </div>

            {activeTab !== 'history' ? (
              loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Đang tải dữ liệu lịch chăm sóc...</p>
                </div>
              ) : error ? (
                <div className="text-center py-4">
                  <p className="text-danger">{error}</p>
                </div>
              ) : (
                <Table bordered hover responsive className="mb-0">
                  <thead className="bg-light">
                    <tr className="text-center">
                      <th style={{width: "50px"}}>STT</th>
                      <th style={{width: "120px"}}>Ngày đặt</th>
                      <th style={{width: "120px"}}>Thú cưng</th>
                      <th>Dịch vụ</th>
                      <th style={{width: "150px"}}>Trạng thái</th>
                      <th style={{width: "120px"}}>Tổng tiền</th>
                      <th style={{width: "100px"}}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length > 0 ? filteredBookings.map((booking, idx) => (
                      <tr key={booking._id} className="align-middle">
                        <td className="text-center">{idx + 1}</td>
                        <td className="text-center">{booking.bookingDate ? formatDate(booking.bookingDate) : booking.order_date}</td>
                        <td>{booking.petName || (booking.pet && booking.pet.name) || ""}</td>
                        <td>{booking.service_type && booking.service_type.name ? booking.service_type.name : booking.service_type}</td>
                        <td className="text-center">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="text-center">{booking.totalPrice ? `${booking.totalPrice.toLocaleString()} đ` : booking.total}</td>
                        <td className="text-center">
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="d-flex align-items-center justify-content-center mx-auto"
                            style={{width: "32px", height: "32px", padding: 0}}
                            onClick={() => handleViewDetails(booking)}
                          >
                            <FaEye />
                          </Button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="7" className="text-center py-3">
                          Không có lịch chăm sóc nào trong mục này
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              )
            ) : (
              // Tab lịch sử
              <div className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0 d-flex align-items-center">
                    <FaHistory className="me-2 text-primary" /> Lịch sử chăm sóc
                  </h5>
                  <div className="d-flex gap-2">
                    <Form.Control 
                      type="text" 
                      placeholder="Tìm kiếm..."
                      className="me-2"
                      style={{width: "200px"}}
                      value={searchTerm}
                      onChange={handleSearch}
                    />
                    <Dropdown className="me-2">
                      <Dropdown.Toggle variant="outline-secondary" id="dropdown-pet">
                        <i className="fas fa-paw me-1"></i> {selectedPet === "all" ? "Tất cả thú cưng" : userPets.find(pet => pet._id === selectedPet)?.name || "Thú cưng"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handlePetFilter("all")}>Tất cả thú cưng</Dropdown.Item>
                        <Dropdown.Divider />
                        {userPets.map(pet => (
                          <Dropdown.Item key={pet._id} onClick={() => handlePetFilter(pet._id)}>
                            {pet.name} ({pet.species})
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" id="dropdown-category">
                        <FaFilter className="me-1" /> {selectedCategory === "all" ? "Tất cả dịch vụ" : selectedCategory}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleCategoryFilter("all")}>Tất cả dịch vụ</Dropdown.Item>
                        <Dropdown.Divider />
                        {serviceCategories.map(category => (
                          <Dropdown.Item key={category._id} onClick={() => handleCategoryFilter(category.name)}>
                            {category.name}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
                
                {historyLoading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">Đang tải lịch sử chăm sóc...</p>
                  </div>
                ) : (
                  <Table bordered hover responsive className="mb-0">
                    <thead className="bg-light">
                      <tr className="text-center">
                        <th style={{width: "50px"}}>STT</th>
                        <th style={{width: "120px"}}>Ngày hoàn thành</th>
                        <th style={{width: "120px"}}>Thú cưng</th>
                        <th>Dịch vụ</th>
                        <th style={{width: "120px"}}>Tổng tiền</th>
                        <th style={{width: "150px"}}>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.length > 0 ? filteredHistory.map((booking, idx) => (
                        <tr key={booking._id} className="align-middle">
                          <td className="text-center">{idx + 1}</td>
                          <td className="text-center">{booking.completedDate ? formatDate(booking.completedDate) : formatDate(booking.bookingDate)}</td>
                          <td>{booking.petName || (booking.pet && booking.pet.name) || ""}</td>
                          <td>{booking.service_type && booking.service_type.name ? booking.service_type.name : booking.service_type}</td>
                          <td className="text-center">{booking.totalPrice ? `${booking.totalPrice.toLocaleString()} đ` : booking.total}</td>
                          <td className="text-center">
                            <div className="d-flex justify-content-center gap-2">
                              <Button
                                variant="outline-info"
                                size="sm"
                                title="Xem chi tiết"
                                onClick={() => handleViewDetails(booking)}
                              >
                                <FaEye />
                              </Button>
                              <Button
                                variant="outline-primary"
                                size="sm"
                                title="Xuất PDF"
                                onClick={() => handleExportPDF(booking._id)}
                              >
                                <FaFilePdf />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="6" className="text-center py-3">
                            Không có lịch sử chăm sóc nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}
              </div>
            )}


              </div>
            </div>
          </Tab>
          
          <Tab eventKey="pending" title="Chờ xác nhận">
            {/* Nội dung tab Chờ xác nhận sẽ được xử lý trong activeTab */}
          </Tab>
          
          <Tab eventKey="confirmed" title="Đã xác nhận">
            {/* Nội dung tab Đã xác nhận sẽ được xử lý trong activeTab */}
          </Tab>
          
          <Tab eventKey="canceled" title="Đã hủy">
            {/* Nội dung tab Đã hủy sẽ được xử lý trong activeTab */}
          </Tab>
          
          <Tab eventKey="history" title={<span><FaHistory className="me-1" /> Lịch sử</span>}>
            {/* Nội dung tab Lịch sử sẽ được xử lý trong activeTab */}
          </Tab>
        </Tabs>
        
        {/* Modal chi tiết lịch chăm sóc */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Chi tiết lịch chăm sóc</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedBooking && (
              <div>
                <Row className="mb-3">
                  <Col md={6}>
                    <h6>Thông tin dịch vụ</h6>
                    <p><strong>Dịch vụ:</strong> {selectedBooking.service_type && selectedBooking.service_type.name ? selectedBooking.service_type.name : selectedBooking.service_type}</p>
                    <p><strong>Ngày đặt:</strong> {selectedBooking.bookingDate ? formatDate(selectedBooking.bookingDate) : selectedBooking.order_date}</p>
                    <p><strong>Thời gian:</strong> {selectedBooking.bookingTime || selectedBooking.time || ""}</p>
                    <p><strong>Trạng thái:</strong> {getStatusBadge(selectedBooking.status)}</p>
                  </Col>
                  <Col md={6}>
                    <h6>Thông tin thú cưng</h6>
                    <p><strong>Tên thú cưng:</strong> {selectedBooking.petName || (selectedBooking.pet && selectedBooking.pet.name) || ""}</p>
                    <p><strong>Loài:</strong> {selectedBooking.pet && selectedBooking.pet.species || ""}</p>
                    <p><strong>Giống:</strong> {selectedBooking.pet && selectedBooking.pet.breed || ""}</p>
                    <p><strong>Tổng tiền:</strong> {selectedBooking.totalPrice ? `${selectedBooking.totalPrice.toLocaleString()} đ` : selectedBooking.total}</p>
                  </Col>
                </Row>
                
                {selectedBooking.description && (
                  <div className="mb-3">
                    <h6>Mô tả</h6>
                    <p>{selectedBooking.description}</p>
                  </div>
                )}
                
                {selectedBooking.note && (
                  <div className="mb-3">
                    <h6>Ghi chú</h6>
                    <p>{selectedBooking.note}</p>
                  </div>
                )}
                
                {selectedBooking.status === "Completed" && (
                  <div className="mb-3">
                    <h6>Kết quả chăm sóc</h6>
                    <p>{selectedBooking.result || "Không có kết quả được ghi lại"}</p>
                  </div>
                )}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            {selectedBooking && selectedBooking.status === "Completed" && (
              <Button variant="primary" onClick={() => handleExportPDF(selectedBooking._id)}>
                <FaFilePdf className="me-1" /> Xuất PDF
              </Button>
            )}
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
        
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </div>
  );
};

export default BookingStatus;
