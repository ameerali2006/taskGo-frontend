import axios from "axios";

const baseURL = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = "An unexpected error occurred. Please try again.";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (data && data.message) {
        errorMessage = data.message;
      } else {
        switch (status) {
          case 400:
            errorMessage = "Bad request. Please check your inputs.";
            break;
          case 401:
            errorMessage = "Unauthorized. Please login again.";
            break;
          case 403:
            errorMessage = "Forbidden. You do not have permission.";
            break;
          case 404:
            errorMessage = "Resource not found.";
            break;
          case 409:
            errorMessage = "Conflict. Resource already exists.";
            break;
          case 500:
            errorMessage = "Internal server error. Please try again later.";
            break;
          default:
            errorMessage = `Error ${status}: Something went wrong.`;
        }
      }
    } else if (error.request) {
      errorMessage = "Network error. Please check your internet connection.";
    }

    error.message = errorMessage;
    return Promise.reject(error);
  }
);

export default api;
