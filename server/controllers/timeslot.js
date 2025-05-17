import createError from "http-errors";
import TimeslotDAO from "../dao/timeslot.js";

class TimeslotController {
  /**
   * Lấy tất cả các timeslot
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async getAllTimeslots(req, res, next) {
    try {
      const slots = await TimeslotDAO.getAllTimeslots();
      // Trả về mảng rỗng thay vì ném ra lỗi khi không có timeslot
      res.send(slots);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tạo timeslot mới
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async createTimeslot(req, res, next) {
    try {
      const { time, availableSlots } = req.body;
      
      // Tạo timeslot mới
      const timeslotData = {
        time,
        availableSlots
      };
      
      const savedSlot = await TimeslotDAO.createTimeslot(timeslotData);
      res.status(201).send(savedSlot);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Cập nhật timeslot
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async updateTimeslot(req, res, next) {
    try {
      const { time, availableSlots } = req.body;
      
      const updatedSlot = await TimeslotDAO.updateTimeslot(
        req.params.id,
        { time, availableSlots }
      );
      
      if (!updatedSlot) {
        throw createError(404, "Không tìm thấy timeslot");
      }
      
      res.send(updatedSlot);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Xóa timeslot
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static async deleteTimeslot(req, res, next) {
    try {
      const deletedSlot = await TimeslotDAO.deleteTimeslot(req.params.id);
      
      if (!deletedSlot) {
        throw createError(404, "Không tìm thấy timeslot");
      }
      
      res.send(deletedSlot);
    } catch (error) {
      next(error);
    }
  }
}

export default TimeslotController;
