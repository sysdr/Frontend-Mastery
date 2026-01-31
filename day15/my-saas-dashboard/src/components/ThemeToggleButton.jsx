import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme();
    return (
        <button onClick={toggleTheme} className="theme-toggle-button">
            Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
    );
}

export default ThemeToggleButton;
