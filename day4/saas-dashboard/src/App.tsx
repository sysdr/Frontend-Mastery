import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';

// For demonstration, a simple "auth guard" concept.
// In a real app, this would check actual auth state.
const isAuthenticated = true; // Simulate being logged in

const App: React.FC = () => {
  // Debug: Log to verify component is rendering
  console.log('App component rendering');
  
  return (
    <Routes>
      {/* Redirect root to dashboard if authenticated, otherwise to login placeholder */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <h2 className="text-3xl font-bold text-center mt-20">Login Page Placeholder</h2>} />

      {/* Protected routes wrapped in DashboardLayout */}
      {isAuthenticated ? (
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} /> {/* Renders at /dashboard */}
          <Route path="settings" element={<SettingsPage />} /> {/* Renders at /dashboard/settings */}
          <Route path="profile" element={<ProfilePage />} /> {/* Renders at /dashboard/profile */}
          {/* Catch-all for /dashboard/* if no other child route matches */}
          <Route path="*" element={<p className="text-red-500 text-center mt-10">404 - Dashboard Page Not Found</p>} />
        </Route>
      ) : (
        <Route path="/login" element={<h2 className="text-3xl font-bold text-center mt-20">Login Page Placeholder</h2>} />
      )}

      {/* Catch-all for any other unmatched routes */}
      <Route path="*" element={<h2 className="text-3xl font-bold text-center mt-20 text-red-600">404 - Page Not Found</h2>} />
    </Routes>
  );
};

export default App;
