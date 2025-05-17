import express from 'express';
import { uploadCloud, uploadImage, deleteImage } from '../configs/cloudinary.js';
import { verifyAccessToken } from '../helpers/jwt_helper.js';

const uploadRouter = express.Router();

// Upload ảnh sử dụng multer middleware
uploadRouter.post('/image', verifyAccessToken, uploadCloud.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không có file nào được tải lên' });
    }
    
    // Trả về thông tin ảnh đã tải lên
    res.status(200).json({
      url: req.file.path,
      publicId: req.file.filename,
      message: 'Tải ảnh lên thành công'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Không thể tải ảnh lên' });
  }
});

// Upload nhiều ảnh
uploadRouter.post('/images', verifyAccessToken, uploadCloud.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Không có file nào được tải lên' });
    }
    
    // Trả về thông tin các ảnh đã tải lên
    const uploadedFiles = req.files.map(file => ({
      url: file.path,
      publicId: file.filename
    }));
    
    res.status(200).json({
      files: uploadedFiles,
      message: `Đã tải lên ${uploadedFiles.length} ảnh thành công`
    });
  } catch (error) {
    console.error('Upload multiple error:', error);
    res.status(500).json({ error: 'Không thể tải ảnh lên' });
  }
});

// Upload ảnh từ base64 string
uploadRouter.post('/image/base64', verifyAccessToken, async (req, res) => {
  try {
    const { base64Image } = req.body;
    
    if (!base64Image) {
      return res.status(400).json({ error: 'Không có dữ liệu ảnh được gửi lên' });
    }
    
    // Upload ảnh lên Cloudinary
    const result = await uploadImage(base64Image);
    
    res.status(200).json({
      url: result.secure_url,
      publicId: result.public_id,
      message: 'Tải ảnh lên thành công'
    });
  } catch (error) {
    console.error('Base64 upload error:', error);
    res.status(500).json({ error: 'Không thể tải ảnh lên' });
  }
});

// Xóa ảnh theo publicId
uploadRouter.delete('/image/:publicId', verifyAccessToken, async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await deleteImage(publicId);
    
    if (result.result === 'ok') {
      res.status(200).json({ message: 'Xóa ảnh thành công' });
    } else {
      res.status(400).json({ error: 'Không thể xóa ảnh' });
    }
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Không thể xóa ảnh' });
  }
});

export default uploadRouter;
