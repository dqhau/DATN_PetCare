import express from "express";
import statisticsController from "../controllers/statistics.js";

const statisticsRouter = express.Router();

// Thống kê tổng quan
statisticsRouter.get("/basic", statisticsController.getBasicStats);

// Thống kê người dùng theo tháng
statisticsRouter.get("/users/by-month", statisticsController.getUserStatsByMonth);

// Thống kê thú cưng theo tháng
statisticsRouter.get("/pets/by-month", statisticsController.getPetStatsByMonth);

// Thống kê đặt lịch theo tháng
statisticsRouter.get("/bookings/by-month", statisticsController.getBookingStatsByMonth);

// Thống kê dịch vụ được đặt nhiều nhất
statisticsRouter.get("/services/top", statisticsController.getTopServices);

export default statisticsRouter;
