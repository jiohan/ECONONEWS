import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api'; // uses axios instance

interface User {
    id: number;
    email: string;
    name: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            // Backend route must start with /auth/me (mapped via proxy if needed)
            // But wait, server.js has app.use('/auth', authRoutes).
            // Frontend proxy in vite.config.ts maps /api -> localhost:3000.
            // Does it map /auth? NO.
            // We need to either update vite proxy OR change backend route to /api/auth.
            // Let's assume we update vite proxy or use full URL.
            // Let's use direct URL for auth redirects, but api axios for fetching json.
            // BUT api axios has baseURL '/api'.
            // So we should probably set backend route to /api/auth OR add /auth to proxy.

            // Let's assume we update vite proxy to include /auth or just everything.
            // For now, let's try reading /auth/me relative to root if proxy is setup properly.
            // Actually, best to use the 'api' instance but we need to ensure the route exists.

            // Current plan: Add /auth to proxy.
            const response = await api.get('/auth/me'); // This assumes api baseURL allows this or we overwrite it.
            // Actually api.ts usually has baseURL '/api'. So this becomes '/api/auth/me'.
            // So on backend, we should use app.use('/api/auth', authRoutes).

            if (response.data.authenticated) {
                setUser(response.data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = () => {
        // Full URL required for external redirect
        window.location.href = 'http://localhost:3000/api/auth/google';
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
            setUser(null);
            window.location.href = '/'; // Force redirect to Landing Page
        } catch (error) {
            console.error("Logout failed", error);
            // Even if API fails, clear local state
            setUser(null);
            window.location.href = '/';
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
