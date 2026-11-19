import axios from "axios";
const backendHost = `${window.location.hostname}:8000`;
const api = axios.create({
    baseURL: `http://${backendHost}/api/`,
});

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
