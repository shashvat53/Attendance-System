const Attendance = require("../models/attendanceModel");

const calculateWorkedHours = (checkIn, checkOut, isLunchDetected) => {
  // Parse the check-in and check-out times
  const [checkInHours, checkInMinutes] = checkIn.split(":").map(Number);
  const [checkOutHours, checkOutMinutes] = checkOut.split(":").map(Number);

  // Convert times to total minutes since midnight
  const checkInTotalMinutes = checkInHours * 60 + checkInMinutes;
  const checkOutTotalMinutes = checkOutHours * 60 + checkOutMinutes;

  // Calculate the total difference in minutes
  let diffInMinutes = checkOutTotalMinutes - checkInTotalMinutes;

  // Handle negative differences (e.g., check-out after midnight)
  if (diffInMinutes < 0) {
    diffInMinutes += 24 * 60; // Add 24 hours in minutes
  }

  // Subtract lunch time (30 minutes) if lunch detection is true
  const workedMinutes = isLunchDetected ? diffInMinutes - 30 : diffInMinutes;

  if (workedMinutes <= 0) return "0:00"; // Ensure valid non-negative worked time

  // Calculate hours and remaining minutes
  let hours = Math.floor(workedMinutes / 60);
  let minutes = workedMinutes % 60;

  // Round minutes to the nearest interval (0, 15, 30, 45, or next hour)
  if (minutes >= 11 && minutes <= 25) {
    minutes = 15;
  } else if (minutes >= 26 && minutes <= 40) {
    minutes = 30;
  } else if (minutes >= 41 && minutes <= 55) {
    minutes = 45;
  } else if (minutes >= 56) {
    // If minutes are 56 or above, round to the next hour
    hours += 1;
    minutes = 0;
  } else {
    minutes = 0; // Default case for 0-10 minutes
  }

  // Return result as "hours:minutes" format
  return `${hours}:${minutes.toString().padStart(2, "0")}`;
};

const roundedFn = (minutes, hours) => {
  if (minutes >= 11 && minutes <= 25) {
    minutes = 15;
  } else if (minutes >= 26 && minutes <= 40) {
    minutes = 30;
  } else if (minutes >= 41 && minutes <= 55) {
    minutes = 45;
  } else if (minutes >= 56) {
    // If minutes are 56 or above, round to the next hour
    hours += 1;
    minutes = 0;
  } else {
    minutes = 0; // Default case for 0-10 minutes
  }

  let roundedValue = `${hours}:${minutes.toString().padStart(2, "0")}`;

  return roundedValue;
};

// Controller function
exports.totalWork = async (req, res) => {
  try {
    const {
      date,
      checkIn,
      checkOut,
      isLunchDetected: initialLunchDetected,
    } = req.body;

    // Validate inputs
    if (!checkIn || !checkOut || typeof initialLunchDetected !== "boolean") {
      return res.status(400).json({ message: "Invalid input data" });
    }

    let [checkInHours, checkInMinutes] = checkIn.split(":").map(Number);
    let [checkOutHours, checkOutMinutes] = checkOut.split(":").map(Number);

    if (checkInHours < 10) {
      (checkInHours = 10), (checkInMinutes = 0);
    }

    let isLunchDetected = initialLunchDetected;
    if (checkInHours > 14 || (checkInHours === 14 && checkInMinutes > 30)) {
      isLunchDetected = false;
    }

    console.log("checkInHours: ", checkInHours);

    let roundedCheckIn = roundedFn(checkInMinutes, checkInHours);
    console.log("roundedCheckIn: ", roundedCheckIn);

    let roundedCheckOut = roundedFn(checkOutMinutes, checkOutHours);
    console.log("roundedCheckIn: ", roundedCheckOut);

    // Calculate total worked hours
    const totalWorkedHours = calculateWorkedHours(
      roundedCheckIn,
      roundedCheckOut,
      isLunchDetected
    );

    // console.log("first", totalWorkedHours);
    // Save the attendance record
    const attendance = new Attendance({
      date,
      checkIn: roundedCheckIn,
      checkOut: roundedCheckOut,
      totalWorkedHours,
      isLunchDetected,
    });

    await attendance.save();

    res.status(201).json({ message: "Recorded successfully", attendance });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ message: "Server error", error });
  }
};
