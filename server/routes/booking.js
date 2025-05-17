import express from "express";
import bookingController from "../controllers/booking.js";
import { verifyAccessToken } from "../helpers/jwt_helper.js";

const bookingRouter = express.Router();

// Tổng dịch vụ đã book
bookingRouter.get("/total-services", bookingController.getTotalServices);

// Tính tổng tiền tất cả services ở trạng thái completed
bookingRouter.get("/revenue-services", bookingController.getRevenueServices);

// Tổng tiền theo từng loại dịch vụ
bookingRouter.get("/revenue-by-service-type", bookingController.getRevenueByServiceType);

// Lấy số lượng giống đực và cái làm dịch vụ
bookingRouter.get("/pet-breeds", bookingController.getPetBreeds);

// Lấy danh sách tất cả các booking theo user
bookingRouter.get("/user/:userId", bookingController.getBookingsByUser);

// Lấy thông tin booking theo ID
bookingRouter.get("/detail/:id", bookingController.getBookingById);

// Lấy tổng số đặt lịch theo trạng thái
bookingRouter.get("/stats/count-by-status", bookingController.getBookingStatsByStatus);

// Lấy danh sách tất cả các booking
bookingRouter.get("/", bookingController.getAllBookings);

// Cập nhật trạng thái booking và lý do nếu chuyển thành 'cancel' api cho user
bookingRouter.put("/update-status/:id", bookingController.updateBookingStatus);

// Lấy danh sách booking theo userId và trạng thái
bookingRouter.get("/:userId/:status", bookingController.getBookingsByUserAndStatus);

// Thêm booking mới
bookingRouter.post("/", bookingController.createBooking);

// Sửa thông tin booking theo ID
bookingRouter.put("/:id", bookingController.updateBooking);

// Xóa booking theo ID
bookingRouter.delete("/:id", bookingController.deleteBooking);

// Cập nhật trạng thái lịch
bookingRouter.put("/status/:id", bookingController.updateBookingStatusWithHistory);

// API để chuyển đổi timeslot cho booking
bookingRouter.put("/change-timeslot/:id", bookingController.changeTimeslot);

export default bookingRouter;
