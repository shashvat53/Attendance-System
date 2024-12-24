import apiInstance from "../config/axios";

export const totalWorkApi = async (data) => {
  try {
    const res = await apiInstance.post("/workhours", data);
    return res.data;
  } catch (error) {
    return error;
  }
};
