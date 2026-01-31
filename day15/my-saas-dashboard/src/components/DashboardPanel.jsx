import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

function DashboardPanel({ title, children }) {
    const { theme } = useTheme();
    return (
        <div className={`dashboard-panel ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
            <h2>{title}</h2>
            {children}
        </div>
    );
}

export default DashboardPanel;
