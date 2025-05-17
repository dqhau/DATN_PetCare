import React, { useEffect, useState } from "react";
import { Col, Container, Row, Table, Button, Modal, Badge, Form, InputGroup } from "react-bootstrap";
import { FaTrash, FaSearch, FaUserEdit, FaUserSlash, FaEye, FaUserCog } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const UserManagement = () => {
  const [listUser, setListUser] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Lấy token từ localStorage
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:9999/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setListUser(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  const formatDate = (inputDate) => {
    if (!inputDate) return "N/A";
    const dateObject = new Date(inputDate);
    if (isNaN(dateObject.getTime())) return "N/A";
    
    const day = dateObject.getDate().toString().padStart(2, "0");
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObject.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };
  
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  
  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setLoading(true);
    try {
      await axios.delete(`http://localhost:9999/users/delete/${userToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Cập nhật danh sách người dùng sau khi xóa
      setListUser(prevUsers => prevUsers.filter(user => user._id !== userToDelete._id));
      toast.success("Xóa người dùng thành công!");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Không thể xóa người dùng");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Lọc danh sách người dùng theo từ khóa tìm kiếm và chỉ hiển thị người dùng có role là "user"
  const filteredUsers = listUser.filter(user => {
    // Chỉ hiển thị người dùng có role là "user"
    if (user.role === "admin") return false;
    
    const searchValue = searchTerm.toLowerCase();
    return (
      (user.fullname && user.fullname.toLowerCase().includes(searchValue)) ||
      (user.username && user.username.toLowerCase().includes(searchValue)) ||
      (user.gmail && user.gmail.toLowerCase().includes(searchValue)) ||
      (user.phone && user.phone.includes(searchValue))
    );
  });
  return (
    <Container fluid>
      <ToastContainer position="top-right" autoClose={3000} />
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h3 className="mb-0">
            <FaUserCog className="me-2" /> Quản Lý Người Dùng
          </h3>
        </Col>
        <Col md={6}>
          <InputGroup>
            <Form.Control
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup>
        </Col>
      </Row>

      <div className="card shadow-sm">
        <div className="card-body p-0">
          <div style={{ overflowX: "auto", width: "100%" }}>
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th style={{ width: "50px" }} className="text-center">STT</th>
                  <th style={{ width: "150px" }}>Họ và Tên</th>
                  <th style={{ width: "120px" }}>Tên đăng nhập</th>
                  <th style={{ width: "120px" }}>Số điện thoại</th>
                  <th style={{ width: "200px" }}>Email</th>
                  <th style={{ width: "100px" }} className="text-center">Vai trò</th>
                  <th style={{ width: "120px" }} className="text-center">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">Đang tải dữ liệu...</td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">Không tìm thấy người dùng nào</td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <tr key={user._id || index}>
                      <td className="text-center">{index + 1}</td>
                      <td>
                        {user.fullname || "N/A"}
                      </td>
                      <td>{user.username || "N/A"}</td>
                      <td>{user.phone || "N/A"}</td>
                      <td>{user.gmail || "N/A"}</td>
                      <td className="text-center">
                        {user.role === "admin" ? (
                          <Badge bg="danger">Admin</Badge>
                        ) : (
                          <Badge bg="info">Người dùng</Badge>
                        )}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="me-1"
                          onClick={() => handleViewDetails(user)}
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </Button>
                        {user.role !== "admin" && (
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            title="Xóa người dùng"
                          >
                            <FaTrash />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa người dùng */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUserSlash className="text-danger me-2" /> Xác nhận xóa người dùng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa người dùng <strong>{userToDelete?.fullname || userToDelete?.username}</strong>?</p>
          <p className="text-danger">Lưu ý: Hành động này không thể hoàn tác!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteUser} disabled={loading}>
            {loading ? "Đang xóa..." : "Xóa người dùng"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xem chi tiết người dùng */}
      <Modal show={showUserDetailsModal} onHide={() => setShowUserDetailsModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUserEdit className="me-2" /> Chi tiết người dùng
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Row>
              <Col md={6}>
                <p><strong>Họ và tên:</strong> {selectedUser.fullname || "N/A"}</p>
                <p><strong>Tên đăng nhập:</strong> {selectedUser.username || "N/A"}</p>
                <p><strong>Email:</strong> {selectedUser.gmail || "N/A"}</p>
                <p><strong>Số điện thoại:</strong> {selectedUser.phone || "N/A"}</p>
              </Col>
              <Col md={6}>
                <p><strong>Ngày sinh:</strong> {formatDate(selectedUser.birthday)}</p>
                <p><strong>Giới tính:</strong> {selectedUser.gender || "N/A"}</p>
                <p><strong>Địa chỉ:</strong> {selectedUser.address || "N/A"}</p>
                <p><strong>Vai trò:</strong> {selectedUser.role === "admin" ? "Admin" : "Người dùng"}</p>
              </Col>
              {selectedUser.pets && selectedUser.pets.length > 0 && (
                <Col md={12} className="mt-3">
                  <h5>Thú cưng ({selectedUser.pets.length})</h5>
                  <Table bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>Tên</th>
                        <th>Loài</th>
                        <th>Giống</th>
                        <th>Tuổi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser.pets.map((pet, index) => (
                        <tr key={index}>
                          <td>{pet.name}</td>
                          <td>{pet.species}</td>
                          <td>{pet.breed}</td>
                          <td>{pet.age} tuổi</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              )}
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserDetailsModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserManagement;
