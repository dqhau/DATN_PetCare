import { petDao } from "../dao/index.js";

// Lấy tất cả thú cưng
const getAllPets = async (req, res) => {
    try {
        const allPets = await petDao.fetchAllPets();
        res.status(200).json(allPets);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Lấy thú cưng theo userId (chỉ lấy thú cưng của user đang đăng nhập)
const getPetsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Kiểm tra nếu userId trong request không khớp với userId trong token
        // Giả sử userId được truyền từ client là của user đang đăng nhập
        // Trong thực tế, cần thêm middleware xác thực để kiểm tra token
        
        const userPets = await petDao.getPetsByUserId(userId);
        res.status(200).json(userPets);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Lấy chi tiết thú cưng theo ID (kiểm tra quyền sở hữu)
const getPetById = async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await petDao.getPetById(id);
        
        if (!pet) {
            return res.status(404).json({ message: "Thú cưng không tồn tại" });
        }
        
        // Kiểm tra quyền sở hữu (userId trong request phải khớp với userId của pet)
        // Trong thực tế, cần lấy userId từ token để so sánh
        const requestUserId = req.query.userId; // Gửi từ client
        
        if (requestUserId && pet.userId.toString() !== requestUserId) {
            return res.status(403).json({ message: "Bạn không có quyền xem thú cưng này" });
        }
        
        res.status(200).json(pet);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Cập nhật thú cưng (kiểm tra quyền sở hữu)
const updatePet = async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await petDao.getPetById(id);
        
        if (!pet) {
            return res.status(404).json({ message: "Thú cưng không tồn tại" });
        }
        
        // Kiểm tra quyền sở hữu
        if (pet.userId.toString() !== req.body.userId) {
            return res.status(403).json({ message: "Bạn không có quyền cập nhật thú cưng này" });
        }
        
        const updatedPet = await petDao.updatePet(id, req.body);
        res.status(200).json(updatedPet);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Xóa thú cưng (kiểm tra quyền sở hữu)
const deletePet = async (req, res) => {
    try {
        const { id } = req.params;
        const pet = await petDao.getPetById(id);
        
        if (!pet) {
            return res.status(404).json({ message: "Thú cưng không tồn tại" });
        }
        
        // Kiểm tra quyền sở hữu
        const requestUserId = req.query.userId; // Gửi từ client
        
        if (requestUserId && pet.userId.toString() !== requestUserId) {
            return res.status(403).json({ message: "Bạn không có quyền xóa thú cưng này" });
        }
        
        const deletedPet = await petDao.deletePet(id);
        res.status(200).json({ message: "Xóa thú cưng thành công", deletedPet });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Lấy thú cưng mới nhất
const getLatestPets = async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 4;
        const latestPets = await petDao.getLatestPets(limit);
        res.status(200).json(latestPets);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};

// Tạo thú cưng mới
const createPet = async (req, res) => {
    try {
        const newPet = await petDao.createPet(req.body);
        res.status(201).json(newPet);
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
};


export default {
    getAllPets,
    getPetsByUserId,
    getPetById,
    updatePet,
    deletePet,
    getLatestPets,
    createPet
}
