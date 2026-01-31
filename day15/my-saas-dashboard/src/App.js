import React from 'react';
import './App.css'; // Import global CSS
import Header from './components/Header';
import DashboardPanel from './components/DashboardPanel';
import UserProfileDisplay from './components/UserProfileDisplay';
import { ThemeProvider } from './contexts/ThemeContext'; // Import ThemeProvider

function AppContent() {
    return (
        <div className="App">
            <Header />
            <main className="app-main">
                <DashboardPanel title="Overview">
                    <p>Welcome to your SaaS Dashboard! Explore your data and settings.</p>
                    <p>This panel's theme changes with the global theme context.</p>
                </DashboardPanel>
                <UserProfileDisplay />
                <DashboardPanel title="Settings">
                    <p>Manage your application settings here.</p>
                </DashboardPanel>
            </main>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
}

export default App;
