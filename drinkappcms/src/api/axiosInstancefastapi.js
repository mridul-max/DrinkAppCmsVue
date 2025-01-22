import axios from "axios";
import Cookies from "js-cookie";

// Create an Axios instance
const pythonApi = axios.create({
  baseURL: "https://fastapi-app-kilo-dev.apps.inholland.hcs-lab.nl/", // Use the proxy for all backend requests
});

// Add a request interceptor to include the JWT token
pythonApi.interceptors.request.use(
  (config) => {
    const token = Cookies.get("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default pythonApi;
