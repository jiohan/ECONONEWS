import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
    // Since we set up the proxy in vite.config.ts, we can just use /api
    // In production, Nginx or similar will handle this, or we set a full URL
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor for global error handling if needed
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle errors globally (e.g. logging, redirect to login)
        console.error('API Error:', error.response || error.message);
        return Promise.reject(error);
    }
);

export default api;
