import express from 'express';
import { petController } from '../controllers/index.js';

const petRouter = express.Router();

// Lấy thú cưng theo userId (chỉ lấy thú cưng của user đang đăng nhập)
petRouter.get('/user/:userId', petController.getPetsByUserId);

// Lấy chi tiết thú cưng theo ID (kiểm tra quyền sở hữu)
petRouter.get('/:id', petController.getPetById);

// Tạo thú cưng mới
petRouter.post('/', petController.createPet);

// Cập nhật thú cưng (kiểm tra quyền sở hữu)
petRouter.put('/:id', petController.updatePet);

// Xóa thú cưng (kiểm tra quyền sở hữu)
petRouter.delete('/:id', petController.deletePet);

export default petRouter;
