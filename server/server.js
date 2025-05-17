//Sử dụng module 'express' để khởi tại 1 web server
import cors from "cors";
import * as dotenv from 'dotenv';
import express, { json } from "express";

import connectDB from "./configs/database.js";


import {
  petRouter,
  userRouter,
  serviceRouter,
  bookingRouter,
  timeslotRouter,
} from "./routes/index.js";
import notificationRouter from "./routes/notification.js";
import statisticsRouter from "./routes/statistics.js";
import uploadRouter from "./routes/upload.js";

dotenv.config();
//Tạo 1 constant 'app'
const app = express();
//Thêm middleware kiểm soát dữ liệu của Request
app.use(cors("*"));
app.use(json());

//Kích hoạt router hoạt động định tuyến cho các request của client

app.get("/", (req, res) => {
  res.send("<h1>Welcom to</h1>");
});
app.use("/pets", petRouter);
app.use("/users", userRouter);
app.use("/service", serviceRouter);
app.use("/booking", bookingRouter);
app.use("/timeslots", timeslotRouter);
app.use("/notifications", notificationRouter);
app.use("/statistics", statisticsRouter);
app.use("/upload", uploadRouter);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const Port = process.env.PORT || 9999

//Lắng nghe các request gửi tới web server tại port

app.listen(Port, async () => {
    connectDB();
    console.log(`web server running on http://localhost:${Port}`);
})
