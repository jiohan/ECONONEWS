import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
    // Direct backend connection to ensure cookies (port 3000) are sent correctly
    baseURL: 'http://localhost:3000/api',
    withCredentials: true, // Crucial for sending cookies cross-port
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
