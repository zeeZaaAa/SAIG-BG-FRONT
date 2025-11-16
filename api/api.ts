import axios from "axios";


let accessToken: string | null = null;

export const setAccessToken = (token: string) => {
  accessToken = token;
  localStorage.setItem("accessToken", token);
};


export const getAccessToken = () => {
  if (!accessToken) {
    accessToken = localStorage.getItem("accessToken");
  }
  return accessToken;
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACK_API, 
  withCredentials: true,
});

// attach token to request
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${getAccessToken()}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// handle refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // เรียก refresh token ผ่าน cookie (HttpOnly)
        const res = await axios.post(`${process.env.NEXT_PUBLIC_BACK_API}/auth/refresh`, {}, { withCredentials: true });
        setAccessToken(res.data.access_token);
        originalRequest.headers.Authorization = `Bearer ${res.data.access_token}`;
        return axios(originalRequest);
      } catch (refreshError) {
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const logout = async () => {
  await api.post('/auth/logout', {}, { withCredentials: true });
  accessToken = null;
  localStorage.removeItem("accessToken");
  window.location.href = "/auth/login";
};

export default api;
