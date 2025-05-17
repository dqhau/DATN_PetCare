import { notificationDao } from "../dao/index.js";

// Lấy tất cả thông báo (cho admin hoặc API mặc định)
const getAllNotifications = async (req, res) => {
  try {
    // Kiểm tra role của người dùng từ token
    const userRole = req.payload?.role;
    const userId = req.payload?.aud;

    // Nếu là admin, trả về thông báo của admin (userId = null)
    if (userRole === 'admin') {
      const notifications = await notificationDao.getAllNotifications();
      return res.status(200).json(notifications);
    }
    
    // Nếu là user, trả về thông báo của user đó
    if (userId) {
      const notifications = await notificationDao.getNotificationsByUserId(userId);
      return res.status(200).json(notifications);
    }

    // Nếu không có thông tin xác thực
    res.status(403).json({ message: "Không có quyền truy cập" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông báo theo userId (cho user)
const getNotificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "UserId không được cung cấp" });
    }
    
    const notifications = await notificationDao.getNotificationsByUserId(userId);
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đánh dấu thông báo đã đọc
const markAsRead = async (req, res) => {
  try {
    const notification = await notificationDao.markAsRead(req.params.id);
    
    if (!notification) {
      return res.status(404).json({ message: "Không tìm thấy thông báo" });
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đánh dấu tất cả thông báo đã đọc (cho admin hoặc API mặc định)
const markAllAsRead = async (req, res) => {
  try {
    // Kiểm tra role của người dùng từ token
    const userRole = req.payload?.role;
    const userId = req.payload?.aud;

    // Nếu là admin, đánh dấu tất cả thông báo của admin đã đọc
    if (userRole === 'admin') {
      await notificationDao.markAllAsRead();
      return res.status(200).json({ success: true });
    }
    
    // Nếu là user, đánh dấu tất cả thông báo của user đó đã đọc
    if (userId) {
      await notificationDao.markAllAsReadForUser(userId);
      return res.status(200).json({ success: true });
    }

    // Nếu không có thông tin xác thực
    res.status(403).json({ message: "Không có quyền truy cập" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đánh dấu tất cả thông báo của một người dùng đã đọc
const markAllAsReadForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "UserId không được cung cấp" });
    }
    
    await notificationDao.markAllAsReadForUser(userId);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy số lượng thông báo chưa đọc (cho admin hoặc API mặc định)
const getUnreadCount = async (req, res) => {
  try {
    // Kiểm tra role của người dùng từ token
    const userRole = req.payload?.role;
    const userId = req.payload?.aud;

    // Nếu là admin, trả về số lượng thông báo chưa đọc của admin
    if (userRole === 'admin') {
      const count = await notificationDao.getUnreadCount();
      return res.status(200).json({ count });
    }
    
    // Nếu là user, trả về số lượng thông báo chưa đọc của user đó
    if (userId) {
      const count = await notificationDao.getUnreadCountForUser(userId);
      return res.status(200).json({ count });
    }

    // Nếu không có thông tin xác thực
    res.status(403).json({ message: "Không có quyền truy cập" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy số lượng thông báo chưa đọc của một người dùng
const getUnreadCountForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ message: "UserId không được cung cấp" });
    }
    
    const count = await notificationDao.getUnreadCountForUser(userId);
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo thông báo mới
const createNotification = async (req, res) => {
  try {
    const { type, message, relatedId, userId } = req.body;
    
    const notificationData = {
      type,
      message,
      relatedId,
      userId: userId || null,
      isRead: false
    };
    
    const savedNotification = await notificationDao.createNotification(notificationData);
    res.status(201).json(savedNotification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default {
  getAllNotifications,
  getNotificationsByUserId,
  markAsRead,
  markAllAsRead,
  markAllAsReadForUser,
  getUnreadCount,
  getUnreadCountForUser,
  createNotification
};
