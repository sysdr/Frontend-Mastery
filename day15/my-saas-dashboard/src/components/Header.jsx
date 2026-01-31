import React from 'react';
import { useUserProfileStore } from '../stores/userProfileStore';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggleButton from './ThemeToggleButton';

function Header() {
    const { userName, isLoggedIn, login, logout } = useUserProfileStore();
    const { theme } = useTheme();

    const handleLogin = () => {
        login('Alice Smith', 'alice@example.com'); // Simulate login
    };

    return (
        <header className={`app-header ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
            <h1>SaaS Dashboard</h1>
            <div className="header-controls">
                <ThemeToggleButton />
                {isLoggedIn ? (
                    <div className="user-info">
                        <span>Welcome, {userName}!</span>
                        <button onClick={logout}>Logout</button>
                    </div>
                ) : (
                    <button onClick={handleLogin}>Login</button>
                )}
            </div>
        </header>
    );
}

export default Header;
