const Attendance = require("../models/attendanceModel");

const calculateWorkedHours = (checkIn, checkOut, isLunchDetected) => {
  // Parse the check-in and check-out times
  const [checkInHours, checkInMinutes] = checkIn.split(":").map(Number);
  const [checkOutHours, checkOutMinutes] = checkOut.split(":").map(Number);

  // Convert times to total minutes since midnight
  const checkInTotalMinutes = checkInHours * 60 + checkInMinutes;
  const checkOutTotalMinutes = checkOutHours * 60 + checkOutMinutes;

  // Calculate the total difference in minutes
  const diffInMinutes = checkOutTotalMinutes - checkInTotalMinutes;

  // Subtract lunch time (30 minutes) if lunch detection is true
  const workedMinutes = isLunchDetected ? diffInMinutes - 30 : diffInMinutes;

  if (workedMinutes <= 0) return "0:00"; // Ensure valid non-negative worked time

  // Calculate hours and remaining minutes
  const hours = Math.floor(workedMinutes / 60);
  const minutes = workedMinutes % 60;

  // Round minutes to the nearest interval (0, 15, 30, 45)
  let roundedMinutes = 0;
  if (minutes >= 11 && minutes <= 25) roundedMinutes = 15;
  else if (minutes >= 26 && minutes <= 40) roundedMinutes = 30;
  else if (minutes >= 41 && minutes <= 59) roundedMinutes = 45;

  // Return result as "hours:minutes" format
  return `${hours}:${roundedMinutes.toString().padStart(2, "0")}`;
};

// Controller function
exports.totalWork = async (req, res) => {
  try {
    const { date, checkIn, checkOut, isLunchDetected } = req.body;

    // Validate inputs
    if (!checkIn || !checkOut || typeof isLunchDetected !== "boolean") {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Calculate total worked hours
    const totalWorkedHours = calculateWorkedHours(
      checkIn,
      checkOut,
      isLunchDetected
    );

    console.log("first", totalWorkedHours);
    // Save the attendance record
    const attendance = new Attendance({
      date,
      checkIn,
      checkOut,
      totalWorkedHours,
      isLunchDetected,
    });

    await attendance.save();

    res.status(201).json({ message: "Recorded successfully", attendance });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
