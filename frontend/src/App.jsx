import { useState } from "react";
// import axios from "axios";
import { totalWorkApi } from "../src/helper/Api";

function App() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0], // Default to today's date
    checkIn: "",
    checkOut: "",
    isLunchDetected: false, // Default to false
  });

  const [totalWorkHour, setTotalWorkHour] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleToggleChange = () => {
    setFormData((prevData) => ({
      ...prevData,
      isLunchDetected: !prevData.isLunchDetected,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData, "Data");
      const response = await totalWorkApi(formData);
      setTotalWorkHour(response);
      console.log(response.totalWorkHour, "111");
      console.log(totalWorkHour, "444");
    } catch (error) {
      console.error("Error saving work hours:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        className="p-4 bg-white border rounded-lg shadow-md w-full max-w-4xl"
        onSubmit={handleSubmit}
      >
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2 border border-gray-300">Today's Date</th>
              <th className="p-2 border border-gray-300">Check-In Time</th>
              <th className="p-2 border border-gray-300">Check-Out Time</th>
              <th className="p-2 border border-gray-300">Lunch Detected</th>
              <th className="p-2 border border-gray-300">Total Work</th>
              <th className="p-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2 border border-gray-300">
                <input
                  type="date"
                  name="date"
                  value={
                    formData.date
                      ? new Date(formData.date).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      date: new Date(e.target.value).toISOString(),
                    }))
                  }
                  className="w-full p-1 border rounded"
                />
              </td>
              <td className="p-2 border border-gray-300">
                <input
                  type="time"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="w-full p-1 border rounded"
                  required
                />
              </td>
              <td className="p-2 border border-gray-300">
                <input
                  type="time"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  className="w-full p-1 border rounded"
                  required
                />
              </td>
              <td className="p-2 border border-gray-300 text-center">
                <div className="flex items-center justify-center ">
                  <label
                    htmlFor="isLunchDetected"
                    className="mr-2 cursor-pointer "
                  >
                    {formData.isLunchDetected ? "Yes" : "No"}
                  </label>
                  <div className="relative">
                    <input
                      id="isLunchDetected"
                      type="checkbox"
                      checked={formData.isLunchDetected}
                      onClick={handleToggleChange}
                      className="sr-only peer"
                    />

                    <div className="w-10 h-5 bg-gray-200 rounded-full peer-checked:bg-green-500 transition-all"></div>
                    <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
                  </div>
                </div>
              </td>
              <td className="p-2 border border-gray-300 text-center">
                <p className="">
                  {totalWorkHour
                    ? totalWorkHour?.attendance?.totalWorkedHours
                    : ""}
                </p>
              </td>
              <td className="p-2 border border-gray-300 text-center">
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  );
}

export default App;
