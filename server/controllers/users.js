import { userDao } from "../dao/index.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

import bcrypt from "bcrypt";
import User from "../models/user.js";

// Cấu hình dotenv
dotenv.config();

const getAllUsers = async (req, res) => {
  try {
    const allUser = await userDao.fetAllUser();
    res.status(200).json(allUser);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};
const updateUser = async (req, res) => {
  try {
    res
      .status(200)
      .json(await userDao.updateUser(req.params.username, req.body));
    console.log("Edit user successfully");
  } catch (error) {
    res.status(500).json({
      error: error.toString(),
    });
    console.log("Edit user failed");
  }
};
const getUserByUserName = async (req, res) => {
  try {
    const username = await userDao.fetchUserByUsername(req.params.username);
    res.status(200).json(username);
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
};

const forgetPass = async (req, res) => {
  const { gmail } = req.body;
  try {
    const user = await userDao.forgotPass(gmail);
    if (!user) {
      return res.send({ Status: "User not found" });
    }

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({ id: user._id }, jwtSecretKey, {
      expiresIn: "1d",
    });

    // Sử dụng thông tin email từ biến môi trường
    var transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const clientUrl = process.env.CLIENT_URL;
    const resetLink = `${clientUrl}/reset-password/${user._id}/${token}`;
    const currentDate = new Date().toLocaleDateString();
    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: gmail,
      subject: "PetCare - Đặt lại mật khẩu của bạn",
      text:
        `Kính gửi Quý khách hàng của PetCare,

Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản PetCare của bạn. Vui lòng nhấp vào liên kết dưới đây để đặt lại mật khẩu:

${resetLink}

Lưu ý:
- Liên kết này chỉ có hiệu lực trong vòng 24 giờ kể từ khi bạn nhận được email này
- Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ của chúng tôi

Nếu bạn gặp bất kỳ vấn đề nào khi đặt lại mật khẩu, vui lòng liên hệ với chúng tôi qua:
- Email: support@petcare.com
- Hotline: 0123-456-789

Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ PetCare.

Trân trọng,
Đội ngũ PetCare
---------------------------------
Email này được gửi tự động, vui lòng không trả lời.
${currentDate}
`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.send({ Status: "Error sending email", Error: error.message });
      } else {
        return res.send({ Status: "Success" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.send({ Status: "Error", Error: error.message });
  }
};

const changePass = async (req, res) => {
  try {
    const { username } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ status: false, message: "Missing required fields" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, message: "Old password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ status: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res
      .status(500)
      .json({ status: false, message: "Server error", error: error.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, message: "Không tìm thấy người dùng" });
    }
    
    // Kiểm tra xem người dùng có phải là admin không
    if (user.role === "admin") {
      return res.status(403).json({ status: false, message: "Không thể xóa tài khoản admin" });
    }
    
    // Xóa người dùng
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ status: true, message: "Xóa người dùng thành công" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ status: false, message: "Lỗi server", error: error.message });
  }
};

export default {
  getAllUsers,
  forgetPass,
  changePass,
  updateUser,
  getUserByUserName,
  deleteUser
};
