import express from "express";
import { verifyAccessToken as verifyToken } from "../helpers/jwt_helper.js";
import notificationController from "../controllers/notification.js";

const notificationRouter = express.Router();

// Lấy thông báo - API cho frontend hiện tại
notificationRouter.get("/", verifyToken, notificationController.getAllNotifications); // API mặc định cho frontend

// API chi tiết hơn cho admin/user
notificationRouter.get("/admin", verifyToken, notificationController.getAllNotifications); // Lấy thông báo cho admin
notificationRouter.get("/user/:userId", verifyToken, notificationController.getNotificationsByUserId); // Lấy thông báo cho user cụ thể

// Đánh dấu đã đọc
notificationRouter.put("/:id/read", verifyToken, notificationController.markAsRead); // Đánh dấu một thông báo đã đọc

// Đánh dấu tất cả đã đọc - API cho frontend hiện tại
notificationRouter.put("/read-all", verifyToken, notificationController.markAllAsRead); // API mặc định cho frontend

// API chi tiết hơn cho admin/user
notificationRouter.put("/admin/read-all", verifyToken, notificationController.markAllAsRead); // Đánh dấu tất cả thông báo của admin đã đọc
notificationRouter.put("/user/:userId/read-all", verifyToken, notificationController.markAllAsReadForUser); // Đánh dấu tất cả thông báo của user đã đọc

// Đếm thông báo chưa đọc
notificationRouter.get("/unread-count", verifyToken, notificationController.getUnreadCount); // API mặc định cho frontend
notificationRouter.get("/admin/unread-count", verifyToken, notificationController.getUnreadCount); // Đếm thông báo chưa đọc của admin
notificationRouter.get("/user/:userId/unread-count", verifyToken, notificationController.getUnreadCountForUser); // Đếm thông báo chưa đọc của user

// Tạo thông báo
notificationRouter.post("/", verifyToken, notificationController.createNotification);

export default notificationRouter;
