import React from 'react';
import './App.css';
import { useAppStore } from './store';
import ThemeToggle from './components/ThemeToggle';
import NotificationPreference from './components/NotificationPreference';

function App() {
  const theme = useAppStore(state => state.theme);

  const appStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme === 'dark' ? '#333' : '#f0f0f0',
    color: theme === 'dark' ? '#f0f0f0' : '#333',
    transition: 'background-color 0.3s, color 0.3s',
  };

  return (
    <div className="App" style={appStyle}>
      <h1>SaaS Dashboard</h1>
      <p>This is a component demonstrating global client state.</p>
      <div style={{ marginBottom: '20px' }}>
        <ThemeToggle />
        <NotificationPreference />
      </div>
      <div style={{ padding: '20px', border: '2px dashed', borderColor: theme === 'dark' ? '#666' : '#999', borderRadius: '10px', marginTop: '20px' }}>
        <h2>Dashboard Metrics</h2>
        <p>Theme Toggles: {useAppStore(state => state.themeTogglesCount)} | Notification Toggles: {useAppStore(state => state.notificationTogglesCount)} | Total Actions: {useAppStore(state => state.totalActions)}</p>
        <p>Notification status: {useAppStore(state => state.notificationsEnabled) ? 'Active' : 'Inactive'}</p>
        <p>Use the buttons above to update these metrics (demo).</p>
      </div>
    </div>
  );
}

export default App;
