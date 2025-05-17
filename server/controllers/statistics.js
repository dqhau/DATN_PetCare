import Booking from "../models/booking.js";
import Service from "../models/service.js";
import User from "../models/user.js";
import Pet from "../models/pet.js";

// Thống kê tổng quan
const getBasicStats = async (req, res) => {
  try {
    // Đếm số lượng người dùng
    const totalUsers = await User.countDocuments({ role: "user" });
    
    // Đếm tổng số thú cưng
    const totalPets = await Pet.countDocuments();
    
    // Đếm tổng số đặt lịch
    const totalBookings = await Booking.countDocuments();
    
    // Đếm số lượng dịch vụ
    const totalServices = await Service.countDocuments();
    
    res.status(200).json({
      totalUsers,
      totalPets,
      totalBookings,
      totalServices
    });
  } catch (error) {
    console.error('Error in getBasicStats:', error);
    res.status(500).json({ message: error.message });
  }
};

// Thống kê người dùng mới theo tháng
const getUserStatsByMonth = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const stats = await User.aggregate([
      {
        $match: {
          role: "user",
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);
    
    // Tạo mảng đầy đủ 12 tháng
    const monthlyData = Array(12).fill(0);
    
    // Điền dữ liệu vào các tháng có người dùng mới
    stats.forEach(item => {
      const monthIndex = item._id.month - 1; // Chuyển từ 1-12 sang 0-11
      monthlyData[monthIndex] = item.count;
    });
    
    res.status(200).json({
      year: currentYear,
      data: monthlyData
    });
  } catch (error) {
    console.error('Error in getUserStatsByMonth:', error);
    res.status(500).json({ message: error.message });
  }
};

// Thống kê thú cưng mới theo tháng
const getPetStatsByMonth = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const stats = await Pet.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);
    
    // Tạo mảng đầy đủ 12 tháng
    const monthlyData = Array(12).fill(0);
    
    // Điền dữ liệu vào các tháng có thú cưng mới
    stats.forEach(item => {
      const monthIndex = item._id.month - 1; // Chuyển từ 1-12 sang 0-11
      monthlyData[monthIndex] = item.count;
    });
    
    res.status(200).json({
      year: currentYear,
      data: monthlyData
    });
  } catch (error) {
    console.error('Error in getPetStatsByMonth:', error);
    res.status(500).json({ message: error.message });
  }
};

// Thống kê đặt dịch vụ theo tháng
const getBookingStatsByMonth = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const stats = await Booking.aggregate([
      {
        $match: {
          appointment_date: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$appointment_date" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.month": 1 } }
    ]);
    
    // Tạo mảng đầy đủ 12 tháng
    const monthlyData = Array(12).fill(0);
    
    // Điền dữ liệu vào các tháng có đặt dịch vụ
    stats.forEach(item => {
      const monthIndex = item._id.month - 1; // Chuyển từ 1-12 sang 0-11
      monthlyData[monthIndex] = item.count;
    });
    
    res.status(200).json({
      year: currentYear,
      data: monthlyData
    });
  } catch (error) {
    console.error('Error in getBookingStatsByMonth:', error);
    res.status(500).json({ message: error.message });
  }
};

// Thống kê dịch vụ được đặt nhiều nhất
const getTopServices = async (req, res) => {
  try {
    console.log('Getting top services...');
    // Đơn giản hóa truy vấn để tránh lỗi
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: "$service_type",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Lấy thông tin dịch vụ từ ID
    const result = [];
    for (const stat of stats) {
      try {
        const service = await Service.findById(stat._id);
        if (service) {
          result.push({
            _id: stat._id,
            count: stat.count,
            service_name: service.name || 'Không xác định'
          });
        } else {
          result.push({
            _id: stat._id,
            count: stat.count,
            service_name: 'Dịch vụ không tồn tại'
          });
        }
      } catch (err) {
        console.error('Error finding service:', err);
        result.push({
          _id: stat._id,
          count: stat.count,
          service_name: 'Lỗi khi tìm dịch vụ'
        });
      }
    }
    
    console.log('Top services result:', result);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in getTopServices:', error);
    res.status(500).json({ message: error.message });
  }
};

export default {
  getBasicStats,
  getUserStatsByMonth,
  getPetStatsByMonth,
  getBookingStatsByMonth,
  getTopServices
};
