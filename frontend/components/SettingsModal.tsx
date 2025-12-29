import React from 'react';
import { useAuth } from '../context/AuthContext';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { user, logout } = useAuth();

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1a202c] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 m-4">
                {/* Header */}
                <div className="bg-[#0891b2] p-6 text-center relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <div className="w-24 h-24 rounded-full border-4 border-white mx-auto mb-3 shadow-lg overflow-hidden bg-white/10">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl text-white font-bold">
                                {user.name?.charAt(0) || 'U'}
                            </div>
                        )}
                    </div>
                    <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                    <p className="text-[#e0f2f1] text-sm">{user.email}</p>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Account Details</label>
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex flex-col gap-2 border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Email</span>
                                <span className="font-medium text-gray-900 dark:text-gray-100">{user.email}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">User ID</span>
                                <span className="font-mono text-xs text-gray-400">#{user.id}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Provider</span>
                                <span className="flex items-center gap-1 text-[#0891b2] font-medium">
                                    <span className="material-symbols-outlined text-sm">verified</span>
                                    Google
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                logout();
                                onClose();
                            }}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 py-3 rounded-lg font-bold transition-colors border border-red-200"
                        >
                            <span className="material-symbols-outlined">logout</span>
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
