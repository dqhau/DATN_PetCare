import Booking from "../models/booking.js";
import Timeslot from "../models/timeslot.js";
import Service from "../models/service.js";
import Notification from "../models/notification.js";
import { bookingDao } from "../dao/index.js";
import createError from "http-errors";

// Lấy tổng số dịch vụ đã book
const getTotalServices = async (req, res) => {
  try {
    const totalservicesBooked = await bookingDao.getTotalServices();
    return res.status(200).json({ totalservicesBooked });
  } catch (error) {
    res.status(500).json({ message: error.toString() });
  }
};

// Tính tổng tiền tất cả services ở trạng thái completed
const getRevenueServices = async (req, res, next) => {
  try {
    const totalAmount = await bookingDao.getRevenueServices();
    res.status(200).json({ totalAmount });
  } catch (error) {
    next(error);
  }
};

// Tổng tiền theo từng loại dịch vụ
const getRevenueByServiceType = async (req, res, next) => {
  try {
    const revenueByServiceType = await bookingDao.getRevenueByServiceType();
    res.status(200).json({ revenueByServiceType });
  } catch (error) {
    next(error);
  }
};

// Lấy số lượng giống đực và cái làm dịch vụ
const getPetBreeds = async (req, res) => {
  try {
    const { maleCount, femaleCount } = await bookingDao.getPetBreeds();
    return res.status(200).json({ maleCount, femaleCount });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Lấy danh sách tất cả các booking theo user
const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Sử dụng trực tiếp Mongoose thay vì gọi qua DAO
    const bookings = await Booking.find({ userId })
      .populate("service_type")
      .populate("timeslot")
      .sort({ createdAt: -1 })
      .exec();
      
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Lấy thông tin booking theo ID
const getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const booking = await bookingDao.getBookingById(id);
    if (!booking) {
      throw createError(404, "Không tìm thấy booking");
    }
    res.send(booking);
  } catch (error) {
    next(error);
  }
};

// Lấy tổng số đặt lịch theo trạng thái
const getBookingStatsByStatus = async (req, res, next) => {
  try {
    const result = await bookingDao.getBookingStatsByStatus();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách tất cả các booking
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await bookingDao.getAllBookings();
    if (bookings.length === 0) {
      throw createError(404, "Không tìm thấy dịch vụ");
    }
    res.send(bookings);
  } catch (error) {
    next(error);
  }
};

// Cập nhật trạng thái booking và lý do nếu chuyển thành 'cancel' api cho user
const updateBookingStatus = async (req, res, next) => {
  try {
    const { cancel_reason } = req.body;
    const booking = await bookingDao.updateBookingStatus(req.params.id, "Cancel", cancel_reason);
    if (!booking) {
      throw createError(404, "Không tìm thấy booking");
    }

    // Tạo thông báo cho admin khi người dùng hủy lịch
    try {
      // Lấy thông tin dịch vụ
      const serviceInfo = await Service.findById(booking.service_type);
      const serviceName = serviceInfo ? serviceInfo.name : 'Không xác định';
      
      // Lấy thông tin thời gian
      const bookingDate = new Date(booking.appointment_date).toLocaleDateString('vi-VN');
      const timeslotInfo = await Timeslot.findById(booking.timeslot);
      const bookingTime = timeslotInfo ? `${timeslotInfo.time}:00` : 'Không xác định';
      
      // Tạo thông báo cho admin (userId = null)
      const notification = new Notification({
        type: 'booking_cancel',
        message: `Hủy đặt lịch: ${booking.customer_name} đã hủy lịch dịch vụ ${serviceName} vào ngày ${bookingDate} lúc ${bookingTime}. Lý do: ${cancel_reason}`,
        relatedId: booking._id,
        userId: null // Thông báo cho admin có userId = null
      });
      
      await notification.save();
      console.log('Notification sent to admin for booking cancellation');
    } catch (notificationError) {
      console.error('Error creating notification:', notificationError);
      // Không throw error để không ảnh hưởng đến việc hủy lịch
    }

    res.send(booking);
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách booking theo userId và trạng thái
const getBookingsByUserAndStatus = async (req, res, next) => {
  try {
    const { userId, status } = req.params;
    const bookings = await bookingDao.getBookingsByUserAndStatus(userId, status);
    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách booking theo userId


// Thêm booking mới
const createBooking = async (req, res, next) => {
  try {
    const {
      userId,
      service_type,
      customer_name,
      phone_number,
      email,
      address,
      appointment_date,
      timeslotId,
      order_status,
      petId,
      pet_info: petInfoPayload,
    } = req.body;

    // 1. Validate bắt buộc
    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }
    if (!timeslotId) {
      return res.status(400).json({ error: "Missing timeslotId" });
    }
    
    // Kiểm tra ngày đặt lịch
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const appointmentDay = new Date(appointment_date);
    appointmentDay.setHours(0, 0, 0, 0);
    
    // Kiểm tra đặt lịch trong quá khứ
    if (appointmentDay < today) {
      return res.status(400).json({ error: "Không thể đặt lịch cho ngày trong quá khứ" });
    }
    
    // Kiểm tra đặt lịch quá xa trong tương lai (tối đa 3 tháng)
    const maxDate = new Date(today);
    maxDate.setMonth(today.getMonth() + 3);
    
    if (appointmentDay > maxDate) {
      return res.status(400).json({ error: "Chỉ có thể đặt lịch tối đa 3 tháng trước" });
    }

    // 2. Kiểm slot
    const timeslot = await Timeslot.findById(timeslotId);
    if (!timeslot) {
      return res.status(400).json({ error: "Timeslot not found" });
    }
    if (timeslot.availableSlots <= 0) {
      return res.status(400).json({ error: "No available slots" });
    }

    // 3. Xác định pet_info
    let pet_info;
    if (petId) {
      // Nếu gửi petId, lookup pet từ collection pets
      const Pet = await import("../models/pet.js").then(m => m.default);
      const pet = await Pet.findOne({ _id: petId, userId });
      
      if (!pet) {
        return res.status(404).json({ error: "Pet not found or does not belong to user" });
      }
      
      // Build đúng theo schema booking.pet_info
      pet_info = {
        pet_name: pet.name,
        species: pet.species,
        breed: pet.breed,
        age: pet.age,
        weight: pet.weight,
        notes: pet.notes || "",
      };
    } else {
      // Không có petId: dùng payload pet_info
      const { pet_name, species, breed, age, weight, notes } = petInfoPayload || {};
      if (!pet_name || !species || !breed || age == null || weight == null) {
        return res.status(400).json({
          error: "Missing pet_info or required pet fields (pet_name, species, breed, age, weight)"
        });
      }
      pet_info = { pet_name, species, breed, age, weight, notes };
    }

    // 4. Tạo booking
    const bookingData = {
      userId,
      service_type,
      customer_name,
      phone_number,
      email,
      address,
      appointment_date,
      timeslot: timeslotId,
      order_status,
      pet_info,
      petId: petId || null,  // lưu petId nếu có
    };

    const savedBooking = await bookingDao.createBooking(bookingData, timeslot);
    
    // 6. Chỉ tạo thông báo cho admin
    const serviceInfo = await Service.findById(service_type);
    const serviceName = serviceInfo ? serviceInfo.name : 'Không xác định';
    const bookingDate = new Date(appointment_date).toLocaleDateString('vi-VN');
    const bookingTime = timeslot.time;
    
    // Tạo thông báo cho admin (userId = null)
    const notification = new Notification({
      type: 'booking',
      message: `Đặt lịch mới: ${customer_name} đã đặt lịch dịch vụ ${serviceName} vào ngày ${bookingDate} lúc ${bookingTime}h`,
      relatedId: savedBooking._id,
      userId: null // Thông báo cho admin có userId = null
    });
    
    await notification.save();
    
    // Không tạo thông báo cho user khi đặt lịch nữa

    res.status(201).json(savedBooking);
  } catch (err) {
    next(err);
  }
};

// Sửa thông tin booking theo ID
const updateBooking = async (req, res, next) => {
  try {
    const {
      service_type,
      customer_name,
      phone_number,
      email,
      address,
      appointment_date,
      timeslotId,
      order_status,
      pet_info,
    } = req.body;
    
    const bookingData = {
      service_type,
      customer_name,
      phone_number,
      email,
      address,
      appointment_date,
      timeslot: timeslotId,
      order_status,
      pet_info,
    };
    
    const booking = await bookingDao.updateBooking(req.params.id, bookingData);
    if (!booking) {
      throw createError(404, "Không tìm thấy booking");
    }

    res.send(booking);
  } catch (error) {
    next(error);
  }
};

// Xóa booking theo ID
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await bookingDao.deleteBooking(req.params.id);
    if (!booking) {
      throw createError(404, "Không tìm thấy booking");
    }

    res.send(booking);
  } catch (error) {
    next(error);
  }
};

// Cập nhật trạng thái lịch
const updateBookingStatusWithHistory = async (req, res, next) => {
  try {
    const result = await bookingDao.updateBookingStatusWithHistory(req.params.id, req.body);
    
    // Chỉ tạo thông báo cho user khi admin cập nhật trạng thái booking
    if (result) {
      // Lấy thông tin dịch vụ
      const serviceInfo = await Service.findById(result.service_type);
      const serviceName = serviceInfo ? serviceInfo.name : 'Không xác định';
      
      // Lấy thông tin ngày và giờ
      const bookingDate = new Date(result.appointment_date).toLocaleDateString('vi-VN');
      const timeslot = await Timeslot.findById(result.timeslot);
      const bookingTime = timeslot ? timeslot.time : '';
      
      let message = '';
      
      // Tạo nội dung thông báo dựa trên trạng thái mới
      if (req.body.order_status === "Processing") {
        message = `Lịch đặt dịch vụ ${serviceName} vào ngày ${bookingDate} lúc ${bookingTime}h của bạn đã được xác nhận`;
      } else if (req.body.order_status === "Completed") {
        message = `Dịch vụ ${serviceName} vào ngày ${bookingDate} lúc ${bookingTime}h của bạn đã được hoàn thành`;
      } else if (req.body.order_status === "Cancel") {
        const reason = req.body.cancel_reason ? ` với lý do: ${req.body.cancel_reason}` : '';
        message = `Lịch đặt dịch vụ ${serviceName} vào ngày ${bookingDate} lúc ${bookingTime}h của bạn đã bị hủy${reason}`;
      }
      
      // Chỉ tạo thông báo nếu có nội dung và userId
      if (message && result.userId) {
        const notification = new Notification({
          type: req.body.order_status === "Cancel" ? 'cancellation' : 
                (req.body.order_status === "Completed" ? 'completion' : 'booking'),
          message: message,
          relatedId: result._id,
          userId: result.userId // Thông báo cho user cụ thể
        });
        
        await notification.save();
      }
    }
    
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// API để chuyển đổi timeslot cho booking
const changeTimeslot = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newTimeslotId } = req.body;
    
    if (!newTimeslotId) {
      return res.status(400).json({ error: "Vui lòng cung cấp ID timeslot mới" });
    }
    
    const result = await bookingDao.changeTimeslot(id, newTimeslotId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error changing timeslot:", error);
    res.status(500).json({ error: error.message || "Lỗi khi chuyển đổi timeslot" });
  }
};

export default {
  getTotalServices,
  getRevenueServices,
  getRevenueByServiceType,
  getPetBreeds,
  getBookingsByUser,
  getBookingById,
  getBookingStatsByStatus,
  getAllBookings,
  updateBookingStatus,
  getBookingsByUserAndStatus,
  createBooking,
  updateBooking,
  deleteBooking,
  updateBookingStatusWithHistory,
  changeTimeslot
};
