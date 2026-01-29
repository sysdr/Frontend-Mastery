import React from 'react';
import './App.css';
import ResilientWidget from './ResilientWidget';

function App() {
  return (
    <div className="App" style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1>SaaS Dashboard</h1>
      <ResilientWidget />
      <p style={{ marginTop: '50px', color: '#666' }}>
        * This widget demonstrates API error handling with retries and fallbacks.
        <br />
        The backend API will randomly fail ~30% of the time. Observe the retry attempts and fallback data.
      </p>
    </div>
  );
}

export default App;
