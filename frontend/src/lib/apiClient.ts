import { API_BASE_URL } from '@/config/api';
import { getToken } from '@/lib/token';
import axios from 'axios';

const apiClient = axios.create({
    baseURL: API_BASE_URL, // Use environment variables for flexibility
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const token = getToken(); // Retrieve token (e.g., from cookies or local storage)
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Refresh token logic here (if applicable)
            console.error("Unauthorized! Handle refresh or logout.");
        }
        return Promise.reject(error);
    }
);

export default apiClient;