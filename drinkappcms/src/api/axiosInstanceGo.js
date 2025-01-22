import axios from "axios";
import Cookies from "js-cookie";

// Create an Axios instance for the Python microservice
const goApi = axios.create({
    baseURL: "https://go-drinkapp-kilo-dev.apps.inholland.hcs-lab.nl/", // Use the proxy for all backend requests
  });

// Add a request interceptor to include the JWT token for Python
goApi.interceptors.request.use(
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

export default goApi;
