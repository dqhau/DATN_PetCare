import express from "express";
import TimeslotController from "../controllers/timeslot.js";

const timeslotRouter = express.Router();

// Lấy tất cả các timeslot
timeslotRouter.get("/", TimeslotController.getAllTimeslots);

// Thêm timeslot mới
timeslotRouter.post("/", TimeslotController.createTimeslot);

// Sửa timeslot theo ID
timeslotRouter.put("/:id", TimeslotController.updateTimeslot);

// Xóa timeslot theo ID
timeslotRouter.delete("/:id", TimeslotController.deleteTimeslot);

export default timeslotRouter;
