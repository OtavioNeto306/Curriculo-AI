import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';

export const LogoutButton: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors w-full"
        >
            <span className="material-symbols-outlined">logout</span>
            <p className="text-sm font-medium leading-normal">Sair</p>
        </button>
    );
};
