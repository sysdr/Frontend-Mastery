// src/App.tsx
import React from 'react';
import UserProfileForm from './components/UserProfileForm';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <UserProfileForm />
    </div>
  );
}

export default App;
