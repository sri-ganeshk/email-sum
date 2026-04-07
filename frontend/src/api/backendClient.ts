import axios from "axios";
import { useAuthStore } from "../store/authStore";

export const backendClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
  withCredentials: true, // send HttpOnly cookies on every request
});

// Attach in-memory access token to every request
backendClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401: attempt token refresh once, then retry original request.
// Skip retry if the failing request IS the refresh endpoint (avoids reload loop).
backendClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL ?? "/api"}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        useAuthStore.getState().setTokens(data.access_token, data.user);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return backendClient(originalRequest);
      } catch {
        useAuthStore.getState().clearAuth();
        // Don't reload — just let the UI show the login page naturally
      }
    }
    return Promise.reject(error);
  }
);
