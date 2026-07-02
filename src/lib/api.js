import axios from "axios";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/authStore";
import { cookiesAuthKey } from "./enum";
import auth from "./auth";
import AppToast from "@/components/ui/toast";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// ── Helpers ───────────────────────────────────────────────────────────────────

const valueToString = (value) => {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString().split("T")[0];
  if (Array.isArray(value)) return value.map(valueToString).join(", ");
  if (value !== null && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) return JSON.stringify(value);
  return String(value);
}

const toFormData = (obj) => {
  const fd = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    const isDateKey = key.includes("date") || key.includes("_at");

    if (value instanceof File || value instanceof Blob) {
      fd.append(key, value);
    } else if (value instanceof Date) {
      fd.append(key, value.toISOString().split("T")[0]);
    } else if (isDateKey && typeof value === "string" && value.length > 0) {
      const parsed = new Date(value);
      fd.append(key, !isNaN(parsed) ? parsed.toISOString().split("T")[0] : value);
    } else if (Array.isArray(value)) {
      const isFileArray = value.length > 0 && value[0] instanceof File;
      if (isFileArray) {
        value.forEach((file) => fd.append(key, file));
      } else if (key === "documents" && value.length > 0 && typeof value[0] === "object") {
        // Handle array of objects (like documents) for nested multipart form-data
        value.forEach((item, index) => {
          Object.entries(item).forEach(([subKey, subValue]) => {
            if (subValue === null || subValue === undefined) return;
            const compoundKey = `${key}[${index}][${subKey}]`;
            if (subValue instanceof File || subValue instanceof Blob) {
              fd.append(compoundKey, subValue);
            } else if (subValue instanceof Date) {
              fd.append(compoundKey, subValue.toISOString().split("T")[0]);
            } else {
              fd.append(compoundKey, String(subValue));
            }
          });
        });
      } else {
        fd.append(key, JSON.stringify(value));
      }
    } else if (typeof value === "object" && !Array.isArray(value)) {
      fd.append(key, JSON.stringify(value));
    } else {
      fd.append(key, String(value));
    }
  });
  return fd;
};

// ── Token refresh queue ──────────────────────────────────────────────────────
// Ensures concurrent 401s only trigger one refresh call; all others are queued.

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

// ── Axios instance ────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token from memory store; strip Content-Type for FormData
api.interceptors.request.use((config) => {
  const cookiesData = Cookies.get(cookiesAuthKey);
  let accessToken = null;
  try {
      const userData = JSON.parse(cookiesData || '{}');
      const isValid =
          userData && typeof userData === 'object' &&
          typeof userData.token === 'string' && userData.token.trim() !== '' &&
          typeof userData.refreshToken === 'string' && userData.refreshToken.trim() !== '' &&
          userData.user &&
          typeof userData.user === 'object' &&
          typeof userData.user.id === 'string' &&
          typeof userData.user.email === 'string';

      if (isValid) {
        accessToken = userData.token;
      }
  } catch {
    // Invalid cookie data; clear auth state
    Cookies.remove(cookiesAuthKey);  
  }
  
  // Fallback to Zustand in-memory token (covers HTTP staging where secure cookie isn't set)
  if (!accessToken) {
    accessToken = useAuthStore.getState().accessToken || null;
  }

  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  if (config.data instanceof FormData) delete config.headers["Content-Type"];
  return config;
});

// Unwrap response.data; on 401 → attempt silent token refresh (OAuth 2.0)
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const body = error.response?.data ?? {};

    // Handle global network/offline errors gracefully
    const isNetworkError = error.message === "Network Error" || error.code === "ERR_NETWORK" || !error.response;
    if (isNetworkError) {
      AppToast.danger("Cannot connect to server. Please check your network connection.");
      return Promise.reject(error);
    }

    if (status === 401 && !originalRequest._retry) {
      
      // Queue concurrent 401s until the refresh resolves
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        
        const newToken = await auth.refreshAccessToken();
        
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // If it is a network error during refresh, do not delete session or force logout
        const isRefreshNetError = refreshError.message === "Network Error" || refreshError.code === "ERR_NETWORK" || !refreshError.response;
        if (isRefreshNetError) {
          return Promise.reject(refreshError);
        }

        Cookies.remove(cookiesAuthKey);
        if (typeof window !== "undefined") {
            localStorage.removeItem(cookiesAuthKey);
            window.location.href = "/login";
        }
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    } else if (status === 403) {
      AppToast.danger("You do not have permission to perform this action.");
    }

    const message = body.message || `Request failed with status ${status}`;
    const err = new Error(message);
    err.status = status;
    err.data = body;
    return Promise.reject(err);
  }
);

// ── HTTP methods ──────────────────────────────────────────────────────────────
const validateUrl = (url) => {
    if (!url || typeof url !== "string") {
        throw new Error("API url is required and must be a string");
    }
};

export const get = ({ url, params = {} }) => {
    validateUrl(url);
    return api.get(url, { params });
};

export const post = ({url, body = {}, isFormData = false}) => {
    validateUrl(url);
    return api.post(url, isFormData ? toFormData(body) : body);
};

export const put = ({url, body = {}, isFormData = false}) => {
    validateUrl(url);
    return api.put( url, isFormData ? toFormData(body) : body);
};

export const patch = ({url, body = {}, isFormData = false}) => {
    validateUrl(url);
    return api.patch(url,isFormData ? toFormData(body) : body);
};

export const del = ({url}) => {
    validateUrl(url);
    return api.delete(url);
};

// Export the axios instance for custom use cases (e.g. streaming, upload progress)
export default api;
