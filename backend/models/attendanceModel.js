const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  date: { type: Date, require: true },
  checkIn: { type: String },
  checkOut: { type: String },
  totalWorkedHours: { type: String },
  isLunchDetected: { type: Boolean },
});

module.exports = mongoose.model("Attendance", attendanceSchema);
