import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

  // Increase timeout to handle Render cold start
  timeout: 30000, // 30 seconds
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

// Handle unauthorized / expired token and network errors
api.interceptors.response.use(
  (response) => response,
  (error) => {

    // Handle expired token
    if (error.response?.status === 401) {

      console.warn("Unauthorized request. Logging out...");

      localStorage.removeItem("token");

      window.location.href = "/";

    }

    // Handle timeout or server sleep
    if (error.code === "ECONNABORTED") {

      console.warn("Request timeout. Backend might be waking up.");

      alert("Server is waking up. Please try again in a few seconds.");

    }

    return Promise.reject(error);

  }
);

export default api;