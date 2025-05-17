import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';
import { uploadImageToCloudinary } from '../utils/uploadUtils';

const EditProfile = ({ editVisible, setEditVisible, data, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    gender: '',
    birthday: '',
    phone: '',
    address: '',
    gmail: data.gmail,
    avatar: data.avatar || ''
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Cập nhật dữ liệu mỗi khi props thay đổi
  useEffect(() => {
    setFormData({
      fullname: data.fullname,
      gender: data.gender,
      birthday: data.birthday,
      phone: data.phone,
      address: data.address,
      gmail: data.gmail,
      avatar: data.avatar || ''
    });
    setPreviewUrl(data.avatar || '');
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Chỉ cập nhật giá trị nếu có sự thay đổi từ người dùng
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  // Xử lý khi chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Tạo URL preview cho ảnh đã chọn
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Xử lý khi click vào nút chọn ảnh
  const handleChooseFile = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Nếu có file ảnh mới được chọn, upload lên server thông qua API
    if (selectedFile) {
      setIsUploading(true);
      try {
        // Hiển thị thông báo đang tải lên
        toast.info("Đang tải ảnh lên, vui lòng đợi...");
        
        // Tiến hành upload ảnh qua API backend
        const avatarUrl = await uploadImageToCloudinary(selectedFile);
        
        if (avatarUrl) {
          // Tạo object mới với dữ liệu cập nhật và avatar mới
          const updatedData = {
            ...formData,
            avatar: avatarUrl
          };
          
          // Gọi API để cập nhật thông tin người dùng
          const response = await axios.put(`http://localhost:9999/users/${data.username}`, updatedData);
          
          // Cập nhật state và thông báo thành công
          setFormData(updatedData);
          onUpdate(data.username, updatedData);
          setEditVisible(false);
          toast.success("Cập nhật người dùng thành công");
        } else {
          toast.error("Không thể tải lên ảnh đại diện. Vui lòng thử lại sau.");
        }
      } catch (error) {
        console.error('Error uploading avatar:', error);
        toast.error("Lỗi khi cập nhật thông tin");
      } finally {
        setIsUploading(false);
      }
    } else {
      // Nếu không có file ảnh mới, chỉ cập nhật thông tin khác
      axios
        .put(`http://localhost:9999/users/${data.username}`, formData)
        .then((res) => {
          onUpdate(data.username, formData);
          setEditVisible(false);
          toast.success("Cập nhật người dùng thành công");
        })
        .catch((error) => {
          console.error('Error updating profile:', error);
          toast.error("Lỗi khi cập nhật thông tin");
        });
    }
  };

  return (
    <Modal show={editVisible} onHide={() => setEditVisible(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin cá nhân</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Phần upload avatar */}
          <div className="text-center mb-4">
            <div 
              style={{ 
                width: '120px', 
                height: '120px', 
                margin: '0 auto', 
                position: 'relative',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1px solid #ddd'
              }}
            >
              {previewUrl ? (
                <Image 
                  src={previewUrl} 
                  alt="Avatar" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <div 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span>Ảnh đại diện</span>
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef}
              style={{ display: 'none' }} 
              accept="image/*"
              onChange={handleFileChange}
            />
            
            <Button 
              variant="outline-primary" 
              size="sm" 
              onClick={handleChooseFile}
              className="mt-2"
              disabled={isUploading}
            >
              {isUploading ? 'Đang tải lên...' : 'Chọn ảnh đại diện'}
            </Button>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Họ Và Tên</Form.Label>
            <Form.Control
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="gmail"
              value={formData.gmail}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Giới Tính</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Chọn Giới Tính</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ngày Sinh</Form.Label>
            <Form.Control
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số Điện Thoại</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Địa Chỉ</Form.Label>
            <Form.Control
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Cập nhật
          </Button>
        </Form>
      </Modal.Body>
      {/* Toast thành công */}
     
    </Modal>
  );
};

export default EditProfile;
