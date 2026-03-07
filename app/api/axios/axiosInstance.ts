import axios from "axios";
import {clearToken, getToken} from "@/utils/getAccessToken";


export const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: { "Content-Type": "application/json" },
})

// Добавляем JWT токен к каждому запросу
axiosInstance.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Если токен протух — чистим и редиректим на авторизацию
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            clearToken();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
