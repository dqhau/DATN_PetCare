import axios from 'axios';

const API_URL = 'http://localhost:9999';

// Hàm upload ảnh sử dụng FormData (cho file từ input)
export const uploadImage = async (file) => {
  try {
    // Tạo form data
    const formData = new FormData();
    formData.append('image', file);

    // Gọi API upload
    const response = await axios.post(`${API_URL}/upload/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(error.response?.data?.error || 'Không thể tải ảnh lên');
  }
};

// Hàm upload nhiều ảnh
export const uploadMultipleImages = async (files) => {
  try {
    // Tạo form data
    const formData = new FormData();
    
    // Thêm nhiều file vào form data
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    // Gọi API upload
    const response = await axios.post(`${API_URL}/upload/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw new Error(error.response?.data?.error || 'Không thể tải ảnh lên');
  }
};

// Hàm upload ảnh từ base64 string (cho ảnh từ canvas, cropper, etc.)
export const uploadBase64Image = async (base64Image) => {
  try {
    // Gọi API upload
    const response = await axios.post(`${API_URL}/upload/image/base64`, 
      { base64Image },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error uploading base64 image:', error);
    throw new Error(error.response?.data?.error || 'Không thể tải ảnh lên');
  }
};

// Hàm xóa ảnh
export const deleteImage = async (publicId) => {
  try {
    // Gọi API xóa
    const response = await axios.delete(`${API_URL}/upload/image/${publicId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw new Error(error.response?.data?.error || 'Không thể xóa ảnh');
  }
};
