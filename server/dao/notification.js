import Notification from "../models/notification.js";

// Lấy tất cả thông báo (cho admin)
const getAllNotifications = async () => {
  return await Notification.find({ userId: null })
    .sort({ createdAt: -1 })
    .populate({
      path: "relatedId",
      select: "customer_name phone_number appointment_date order_status"
    });
};

// Lấy thông báo theo userId (cho user)
const getNotificationsByUserId = async (userId) => {
  return await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "relatedId",
      select: "customer_name phone_number appointment_date order_status"
    });
};

// Đánh dấu thông báo đã đọc
const markAsRead = async (id) => {
  return await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );
};

// Đánh dấu tất cả thông báo đã đọc (cho admin)
const markAllAsRead = async () => {
  return await Notification.updateMany({ userId: null }, { isRead: true });
};

// Đánh dấu tất cả thông báo của một người dùng đã đọc
const markAllAsReadForUser = async (userId) => {
  return await Notification.updateMany({ userId }, { isRead: true });
};

// Lấy số lượng thông báo chưa đọc (cho admin)
const getUnreadCount = async () => {
  return await Notification.countDocuments({ userId: null, isRead: false });
};

// Lấy số lượng thông báo chưa đọc của một người dùng
const getUnreadCountForUser = async (userId) => {
  return await Notification.countDocuments({ userId, isRead: false });
};

// Tạo thông báo mới
const createNotification = async (notificationData) => {
  const newNotification = new Notification(notificationData);
  return await newNotification.save();
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
