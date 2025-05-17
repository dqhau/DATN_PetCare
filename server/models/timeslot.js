import mongoose, { Schema } from "mongoose";

const TimeslotSchema = new Schema({
  time: {
    type: Number,
    required: true,
    unique: true,
  },
  availableSlots: {
    type: Number,
    required: true,
    default: 10,
  },
});

const Timeslot = mongoose.model("Timeslot", TimeslotSchema);
export default Timeslot;
