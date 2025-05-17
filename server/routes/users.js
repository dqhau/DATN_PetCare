import createError from "http-errors";
import User from "../models/user.js";
import express from "express";
import bcrypt from "bcrypt";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} from "../helpers/jwt_helper.js";
import { userController } from "../controllers/index.js";
import jwt from "jsonwebtoken";
import VaccinationHistory from "../models/VaccinationHistory.js";
import dotenv from 'dotenv';

// Cấu hình dotenv
dotenv.config();

const usersRouter = express.Router();
usersRouter.get('/',userController.getAllUsers)
usersRouter.put('/:username',userController.updateUser)
usersRouter.get("/:username", userController.getUserByUserName);
usersRouter.put("/changepass/:username", userController.changePass);
usersRouter.post("/forgot-password", userController.forgetPass);
usersRouter.delete("/delete/:id", verifyAccessToken, userController.deleteUser);

usersRouter.post("/reset-password/:id/:token", (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  
  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      return res.json({ Status: "Error with token", Error: err.message });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          User.findByIdAndUpdate({ _id: id }, { password: hash })
            .then((u) => res.send({ Status: "Success" }))
            .catch((err) => res.send({ Status: "Error", Error: err.message }));
        })
        .catch((err) => res.send({ Status: "Error", Error: err.message }));
    }
  });
});



usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}).exec();
    if (users.length === 0) throw createError(404, "Không tìm thấy người dùng");
    res.send(users);
  } catch (error) {
    next(error);
  }
});


usersRouter.get("/pet/:userId", async (req, res, next) => {
 try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("pets");
    if (!user) return next(createError(404, "User not found"));

    res.json(user.pets);
  } catch (err) {
    next(err);
  }
});

usersRouter.get("/vacxin/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const history = await VaccinationHistory
      .find({ userId })
      .sort({ date: -1 })   
       .populate({
        path: "bookingId",
        populate: {
            path: "service_type",
            model: "Service"
          }
      })    
      .lean();

    res.json(history);
  } catch (err) {
    next(err);
  }
});

usersRouter.post("/register", async (req, res, next) => {
  try {
    const { username, password, fullname } = req.body;
    if (!username || !password || !fullname) {
      throw createError.BadRequest("Yêu cầu nhập tên người dùng và mật khẩu");
    }
    const existingUser = await User.findOne({ username: username }).exec();
    if (existingUser) throw createError.Conflict("Người dùng đã tồn tại");
    
    const hashPass = await bcrypt.hash(
      password,
      parseInt(process.env.PASSWORD_SECRET)
    );
    
    // Thiết lập role là 'user' cho người dùng mới đăng ký
    const newUser = new User({
      fullname, 
      username, 
      password: hashPass,
      role: "user" //mặc định là 'user'
    });
    
    const savedUser = await newUser.save();
    const accessToken = await signAccessToken(savedUser._id);
    res.send({ accessToken, newUser });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username }).exec();
    if (!user) throw createError.NotFound("User not registered");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw createError.Unauthorized("Username or password is incorrect");

    const accessToken = await signAccessToken(user._id);
    const refreshToken = await signRefreshToken(user._id);

    res
      .status(200)
      .json({
        username: user.username,
        accessToken,
        refreshToken,
        id: user._id,
        fullname: user.fullname,
        role: user.role,
      });
  } catch (error) {
    next(error);
  }
});


usersRouter.post("/add-pet", async (req, res, next) => {
  try {
    const petData = req.body;
    // validate required fields
    if (!petData.name || !petData.species) {
      return next(createError(400, "Missing required fields: name, species"));
    }

    const user = await User.findById(petData.userId);
    if (!user) return next(createError(404, "User not found"));

    // Mongoose sẽ tự generate _id cho subdoc
    const newPet = user.pets.create(petData);
    user.pets.push(newPet);
    await user.save();

    res.status(201).json(newPet);
  } catch (err) {
    next(err);
  }
});

usersRouter.put("/pet/:petId/:userId", async (req, res, next) => {
  try {
    const { userId, petId } = req.params;

    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found"));

    const pet = user.pets.id(petId);
    if (!pet) return next(createError(404, "Pet not found"));

    // Áp dụng updates
    Object.assign(pet, req.body);
    await user.save();

    res.json(pet);
  } catch (err) {
    next(err);
  }
});

usersRouter.delete("/pet/:petId/:userId", async (req, res, next) => {
  try {
    const { userId, petId } = req.params;
   
    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found"));

    const pet = user.pets.id(petId);
    if (!pet) return next(createError(404, "Pet not found"));

    user.pets.pull(petId);
    await user.save();

    res.json({ message: "Pet deleted successfully", petId });
  } catch (err) {
    next(err);
  }
});

usersRouter.delete("/logout", async (req, res, next) => {
  res.send("Đường dẫn Đăng xuất");
});

usersRouter.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      throw createError.BadRequest("Refresh token không hợp lệ");
    const userId = await verifyRefreshToken(refreshToken);
    if (userId) {
      const accessToken = await signAccessToken(userId);
      const newRefreshToken = await signRefreshToken(userId);
      res.send({ accessToken, refreshToken: newRefreshToken });
    }
  } catch (error) {
    next(error);
  }
});// Trong file usersRouter.js

usersRouter.put("/:username", async (req, res, next) => {
  try {
    const { username } = req.params;
    const updatedUserData = req.body; // Dữ liệu người dùng được gửi từ client

    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      updatedUserData,
      { new: true } 
    );

    if (!updatedUser) {
      throw createError(404, `Người dùng ${username} không tồn tại`);
    }

    res.send(updatedUser); // Trả về thông tin người dùng đã được cập nhật
  } catch (error) {
    next(error);
  }
});


export default usersRouter;
