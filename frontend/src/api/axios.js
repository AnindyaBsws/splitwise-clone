import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // Prevent requests from hanging forever
  timeout: 10000, // 10 seconds
});


// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

  },
  (error) => {
    return Promise.reject(error);
  }
);


// Handle unauthorized / expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {

      console.warn("Unauthorized request. Logging out...");

      localStorage.removeItem("token");

      window.location.href = "/";

    }

    return Promise.reject(error);

  }
);

export default api;