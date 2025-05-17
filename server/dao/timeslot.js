import Timeslot from "../models/timeslot.js";

class TimeslotDAO {
  /**
   * Lấy tất cả các timeslot
   * @returns {Promise<Array>} Danh sách timeslot
   */
  static async getAllTimeslots() {
    try {
      return await Timeslot.find({}).exec();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Tạo timeslot mới
   * @param {Object} timeslotData - Dữ liệu timeslot mới
   * @returns {Promise<Object>} Timeslot đã tạo
   */
  static async createTimeslot(timeslotData) {
    try {
      const newTimeslot = new Timeslot(timeslotData);
      return await newTimeslot.save();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cập nhật timeslot
   * @param {string} id - ID của timeslot
   * @param {Object} updateData - Dữ liệu cập nhật
   * @returns {Promise<Object>} Timeslot đã cập nhật
   */
  static async updateTimeslot(id, updateData) {
    try {
      return await Timeslot.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * Xóa timeslot
   * @param {string} id - ID của timeslot
   * @returns {Promise<Object>} Timeslot đã xóa
   */
  static async deleteTimeslot(id) {
    try {
      return await Timeslot.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

export default TimeslotDAO;
