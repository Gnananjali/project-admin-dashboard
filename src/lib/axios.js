import axios from "axios";
import { getToken, clearToken } from "./auth";

/**
 * One shared Axios instance for the whole app.
 *
 * Why one file: the assignment asks for a single place that (a) attaches the
 * login token to every request and (b) handles errors consistently. Doing
 * this here means no component ever has to remember to add a header or
 * catch a 401 itself.
 */
const api = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 10000,
});

// --- Request interceptor: attach the token to every outgoing request ---
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: normalize errors in one place ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Build one consistent shape so UI code never has to guess whether a
    // message lives on error.response.data.message, error.message, etc.
    const status = error.response?.status;
    const serverMessage =
      error.response?.data?.message || error.response?.data?.error;

    let message = serverMessage || error.message || "Something went wrong.";

    if (status === 401) {
      message = "Your session has expired. Please log in again.";
      clearToken();
      // Redirect to login only if we're in the browser and not already there.
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    if (error.code === "ECONNABORTED") {
      message = "The request timed out. Please try again.";
    }

    return Promise.reject({ status, message, raw: error });
  }
);

export default api;
