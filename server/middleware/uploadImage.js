import multer from 'multer';

// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads'); // Thư mục lưu trữ hình ảnh
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Đổi tên hình ảnh để tránh trùng lặp
    }
});

// Xử lý upload với multer
const upload = multer({ storage: storage }).single('image'); // 'image' là tên trường trong form

// Xử lý upload hình ảnh và thêm đường dẫn hình ảnh vào sản phẩm
export const uploadImage = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json({ message: err.message });
        } else if (err) {
            return res.status(500).json({ message: err.message });
        }
        // Nếu không có lỗi, lưu đường dẫn hình ảnh vào trường image của sản phẩm
        req.imagePath = req.file.path;
        next();
    });
};
