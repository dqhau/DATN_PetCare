import mongoose from "mongoose";

const vaccinationHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  vaccineType: {
    type: String,    // ví dụ: “Rabies”, “DHPPi”
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  notes: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});

const VaccinationHistory = mongoose.model(
  "VaccinationHistory",
  vaccinationHistorySchema
);
export default VaccinationHistory;
