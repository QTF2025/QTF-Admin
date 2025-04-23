import axios from "axios";
import localStorageContent from "../localstorage";

const URL = axios.create({
  //baseURL: "http://68.183.92.155:8080/v1",
  //baseURL: "http://134.209.150.58:8080/v1",
  //baseURL: 'https://api.crescenttaxfiling.com/v1'
  baseURL: process.env.REACT_APP_API_BASE_URL
});


URL.interceptors.request.use(
  async (config: any) => {
    const accessToken = localStorageContent.getAccessToken();
    if (accessToken) {
      config.headers = {
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return config;
  },
  (error: any) => { 
    return Promise.reject(error);
  }
);

URL.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    // Check if we have an error and the error is a 401
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();

      if (newToken) {
        // Retry the request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return URL(originalRequest);
      } else {
        // If token refresh fails, log out the user
        localStorage.clear();
        window.location.href = "/unauthorized";
        return Promise.reject("Unauthorized");
      }
    }

    // Handle other errors and rejections
    if (error?.response) {
      const errorMessage = error.response.data.message || "An error occurred";
      return Promise.reject(errorMessage);
    } else if (error.request) {
      return Promise.reject("No response received");
    } else {
      return Promise.reject("Request setup error");
    }
  }
);

const refreshAccessToken = async () => {
  try {
    const localUserData = localStorageContent.getUserData();
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) throw new Error("No refresh token available");

    const response = await URL.post(`/auth/refresh-tokens`, {
      refreshToken,
      deptId: localUserData?.departmentId,
    });

    if (response?.status === 200) {
      const newAccessToken = response.data.data.access.token;
      const newRefreshToken = response.data.data.refresh.token;

      // Store new tokens
      localStorage.setItem("access_token", newAccessToken);
      localStorage.setItem("refresh_token", newRefreshToken);

      // Redirect after refreshing tokens
      const redirectPath =
        localUserData?.departmentId === 7 || localUserData?.departmentId === 9
          ? "/reports"
          : "/dashboard";
      window.location.href = redirectPath;

      return newAccessToken;
    }
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return null;
  }
};

export default URL;

