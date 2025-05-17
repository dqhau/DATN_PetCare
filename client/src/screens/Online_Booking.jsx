import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Button, Col, Row } from "react-bootstrap";
import logo from "../assets/images/logo.png";
import Form from "react-bootstrap/Form";
import { Toast } from "primereact/toast";
import New_Paper from "../components/New_Paper.jsx";

const Online_Booking = () => {
  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [errors, setErrors] = useState({});
  const toast = useRef(null);
  const [showSlots, setShowSlots] = useState(false);

  const [bookingData, setBookingData] = useState({
    service_type: "",
    petId: "",
    description: "",
    customer_name: "",
    phone_number: "",
    email: "",
    address: "",
    appointment_date: "",
    timeslotId: "",
    userId: "",
  });
  
  // Danh sách pet của user để chọn
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  // Load services
  useEffect(() => {
    axios
      .get("http://localhost:9999/service")
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  // Load pets của user
  useEffect(() => {
    if (userId) {
      setLoadingPets(true);
      fetch(`http://localhost:9999/pets/user/${userId}`)
        .then((resp) => {
          if (!resp.ok) {
            throw new Error(`HTTP error! Status: ${resp.status}`);
          }
          return resp.json();
        })
        .then((data) => {
          console.log("Pets data received:", data);
          setPets(Array.isArray(data) ? data : []);
          setLoadingPets(false);
        })
        .catch((err) => {
          console.error("Error fetching user's pets:", err);
          setPets([]);
          setLoadingPets(false);
        });
    }
  }, [userId]);

  // Load all slots
  useEffect(() => {
    axios
      .get("http://localhost:9999/timeslots")
      .then((res) => setSlots(res.data))
      .catch((err) => console.error("Error fetching slots:", err));
  }, []);

  // Set userId into bookingData
  useEffect(() => {
    setBookingData((prev) => ({ ...prev, userId }));
  }, [userId]);

  // Fetch all available slots
  const fetchSlotsByDate = async (date) => {
    try {
      // Trong model mới, chúng ta không cần lọc theo ngày nữa
      console.log("Fetching all available slots");
      const res = await axios.get(`http://localhost:9999/timeslots`);
      console.log("Slots received:", res.data);
      
      setSlots(res.data);
      if (res.data.length === 0) {
        toast.current.show({
          severity: 'info',
          summary: 'Thông báo',
          detail: 'Không có khung giờ nào cho ngày này. Vui lòng chọn ngày khác.',
          life: 3000
        });
      }
    } catch (err) {
      console.error("Error fetching slots by date:", err);
      toast.current.show({
        severity: 'error',
        summary: 'Lỗi',
        detail: 'Không thể lấy thông tin khung giờ. Vui lòng thử lại sau.',
        life: 3000
      });
    }
  };

  // Handle top-level form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "petId") {
      // chọn pet có sẵn: reset pet_info
      setBookingData((prev) => ({
        ...prev,
        petId: value,
        pet_info: { pet_name: "", species: "", breed: "", age: "", weight: "", notes: "" },
      }));
      return;
    }
    if (name === "appointment_date") {
      fetchSlotsByDate(value);
      setShowSlots(true);
    }
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
      timeslotId: name === "appointment_date" ? "" : prev.timeslotId,
    }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!bookingData.service_type) newErrors.service_type = "Yêu cầu dịch vụ là bắt buộc";
    if (!bookingData.petId) newErrors.petId = "Vui lòng chọn thú cưng";
    if (!bookingData.description) newErrors.description = "Mô tả tình trạng/yêu cầu là bắt buộc";
    if (!bookingData.customer_name) newErrors.customer_name = "Họ và tên là bắt buộc";
    if (!bookingData.phone_number) newErrors.phone_number = "Số điện thoại là bắt buộc";
    if (!bookingData.email) newErrors.email = "Email là bắt buộc";
    if (!bookingData.address) newErrors.address = "Địa chỉ là bắt buộc";
    if (!bookingData.appointment_date) newErrors.appointment_date = "Ngày hẹn là bắt buộc";
    if (!bookingData.timeslotId) newErrors.timeslotId = "Vui lòng chọn khung giờ";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit booking
  const handleSubmit = async () => {
    
    if (!validate()) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Vui lòng điền đầy đủ thông tin",
        life: 3000,
      });
      return;
    }
    
    // Kiểm tra xem đã chọn timeslot chưa
    if (!bookingData.timeslotId) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Vui lòng chọn khung giờ",
        life: 3000,
      });
      return;
    }
    
    try {
      console.log("Preparing booking data...");
      
      const payload = {
        service_type: bookingData.service_type,
        petId: bookingData.petId,
        description: bookingData.description,
        customer_name: bookingData.customer_name,
        phone_number: bookingData.phone_number,
        email: bookingData.email,
        address: bookingData.address,
        appointment_date: bookingData.appointment_date,
        timeslotId: bookingData.timeslotId,
        userId: bookingData.userId
      };
      
      console.log("Sending booking request with payload:", payload);
      
      // Sử dụng fetch thay vì axios để xử lý lỗi tốt hơn
      const response = await fetch("http://localhost:9999/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      // Kiểm tra response status
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Booking successful:", data);
      
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Yêu cầu đặt lịch thành công",
        life: 3000,
      });
      
      // reset form
      setBookingData({
        service_type: "",
        petId: "",
        description: "",
        customer_name: "",
        phone_number: "",
        email: "",
        address: "",
        appointment_date: "",
        timeslotId: "",
        userId,
      });
      setShowSlots(false);
      setSlots([]);
      setErrors({});
      setSelectedSlot("");
    } catch (err) {
      console.error("Error creating booking:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: `Lỗi: ${err.message || "Không thể đặt lịch. Vui lòng thử lại sau."}`,
        life: 5000,
      });
    }
  };

  return (
    <div>
      <Row>
        <div
          className="mt-3 text-center"
          style={{ backgroundColor: "#f4f5f5", width: "100%", height: "200px" }}
        >
          <img src={logo} alt="logo" />
        </div>
      </Row>

      <Row>
        <Col md={{ span: 10, offset: 1 }}>
          <Row>
            <Col md={8}>
              <Form>
                {/* Chọn dịch vụ */}
                <Form.Group controlId="serviceType">
                  <Form.Label>Yêu Cầu Dịch Vụ</Form.Label>
                  <Form.Control
                    as="select"
                    name="service_type"
                    value={bookingData.service_type}
                    onChange={handleInputChange}
                    isInvalid={!!errors.service_type}
                  >
                    <option value="">Chọn dịch vụ</option>
                    {services.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.service_type}</Form.Control.Feedback>
                </Form.Group>
                
                {/* Chọn thú cưng */}
                <Form.Group controlId="petId">
                  <Form.Label>Chọn thú cưng</Form.Label>
                  <Form.Control
                    as="select"
                    name="petId"
                    value={bookingData.petId}
                    onChange={handleInputChange}
                    isInvalid={!!errors.petId}
                  >
                    <option value="">-- Chọn thú cưng --</option>
                    {loadingPets ? (
                      <option value="" disabled>Đang tải danh sách thú cưng...</option>
                    ) : Array.isArray(pets) && pets.length > 0 ? (
                      pets.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} ({p.species} - {p.breed})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>Bạn chưa có thú cưng nào. Vui lòng thêm thú cưng trước.</option>
                    )}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">{errors.petId}</Form.Control.Feedback>
                  {pets.length === 0 && !loadingPets && (
                    <div className="text-danger mt-2">
                      <small>Bạn chưa có thú cưng nào. Vui lòng thêm thú cưng trước khi đặt lịch.</small>
                    </div>
                  )}
                </Form.Group>

                {/* Thông tin khách */}
                <Form.Group controlId="customerName">
                  <Form.Label>Họ và Tên</Form.Label>
                  <Form.Control
                    name="customer_name"
                    value={bookingData.customer_name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.customer_name}
                  />
                  <Form.Control.Feedback type="invalid">{errors.customer_name}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="phoneNumber">
                  <Form.Label>Số Điện Thoại</Form.Label>
                  <Form.Control
                    name="phone_number"
                    value={bookingData.phone_number}
                    onChange={handleInputChange}
                    isInvalid={!!errors.phone_number}
                  />
                  <Form.Control.Feedback type="invalid">{errors.phone_number}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="address">
                  <Form.Label>Địa Chỉ</Form.Label>
                  <Form.Control
                    name="address"
                    value={bookingData.address}
                    onChange={handleInputChange}
                    isInvalid={!!errors.address}
                  />
                  <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                </Form.Group>

                {/* Thời gian & slot */}
                <Form.Group controlId="appointmentDate">
                  <Form.Label>Ngày hẹn</Form.Label>
                  <Form.Control
                    type="date"
                    name="appointment_date"
                    min={new Date().toISOString().split("T")[0]}
                    max={(() => {
                      const maxDate = new Date();
                      maxDate.setMonth(maxDate.getMonth() + 3);
                      return maxDate.toISOString().split("T")[0];
                    })()}
                    value={bookingData.appointment_date}
                    onChange={handleInputChange}
                    isInvalid={!!errors.appointment_date}
                  />
                  <Form.Control.Feedback type="invalid">{errors.appointment_date}</Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    Chọn ngày để xem các khung giờ có sẵn (tối thiểu hôm nay, tối đa 3 tháng kể từ hôm nay)
                  </Form.Text>
                </Form.Group>

                {showSlots && (
                  <Form.Group controlId="slot">
                    <Form.Label>Chọn khung giờ</Form.Label>
                    {slots.length === 0 ? (
                      <div className="alert alert-info">
                        Không có khung giờ nào cho ngày này. Vui lòng chọn ngày khác.
                      </div>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {slots.map((slot) => (
                          <Button
                            key={slot._id}
                            value={slot._id}
                            variant={bookingData.timeslotId === slot._id ? "success" : "outline-primary"}
                            disabled={slot.availableSlots === 0}
                            onClick={() => {
                              setSelectedSlot(slot._id);
                              setBookingData((prev) => ({ ...prev, timeslotId: slot._id }));
                            }}
                            className={slot.availableSlots === 0 ? "opacity-50" : ""}
                          >
                            <div className="text-center">
                              <div>{slot.time}:00</div>
                              <small className={slot.availableSlots < 3 ? "text-danger" : "text-muted"}>
                                {slot.availableSlots > 0 ? `Còn ${slot.availableSlots} chỗ` : "Hết chỗ"}
                              </small>
                            </div>
                          </Button>
                        ))}
                      </div>
                    )}
                    {bookingData.timeslotId && (
                      <div className="mt-2 text-success">
                        Bạn đã chọn khung giờ: {slots.find(s => s._id === bookingData.timeslotId)?.time}:00
                      </div>
                    )}
                  </Form.Group>
                )}


                {/* Mô tả tình trạng/yêu cầu */}
                <Form.Group controlId="description">
                  <Form.Label>Mô tả tình trạng/yêu cầu</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    placeholder="Mô tả tình trạng thú cưng hoặc yêu cầu cụ thể của bạn..."
                    value={bookingData.description}
                    onChange={handleInputChange}
                    isInvalid={!!errors.description}
                  />
                  <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col className="mt-3">
                    <Button onClick={handleSubmit}>Gửi yêu cầu</Button>
                  </Col>
                </Row>
              </Form>
            </Col>

            <Col md={4}>
              <New_Paper />
            </Col>
          </Row>
        </Col>
      </Row>

      <Toast ref={toast} />
    </div>
  );
};

export default Online_Booking;
