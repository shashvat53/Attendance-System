import axios from "axios";
const backendDomain = "http://localhost:8000/api";

const apiInstance = axios.create({
  baseURL: backendDomain,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export default apiInstance;
// 2:21 timing
