
import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [activeUsers, setActiveUsers] = useState(1250);
  const [revenue, setRevenue] = useState(45230);
  const [requests, setRequests] = useState(8920);
  const [uptime, setUptime] = useState(99.8);

  // Demo execution: Auto-update metrics
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setActiveUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
      setRevenue(prev => prev + Math.floor(Math.random() * 100));
      setRequests(prev => prev + Math.floor(Math.random() * 10));
      setUptime(prev => Math.max(99.5, Math.min(100, prev + (Math.random() * 0.1 - 0.05))));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Our SaaS Dashboard Universe!</h1>
      
      {/* Dashboard Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', margin: '20px 0', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Active Users</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#42b883' }}>{activeUsers.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Revenue</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#646cff' }}>${revenue.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>API Requests</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#ff6b6b' }}>{requests.toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#666' }}>Uptime</h3>
          <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#4ecdc4' }}>{uptime.toFixed(2)}%</p>
        </div>
      </div>

      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit src/App.tsx and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p>
        <strong>Welcome to Day 1 of Modern Frontend Mastery!</strong>
      </p>
      <p style={{ fontSize: '12px', color: '#888', marginTop: '20px' }}>
        📊 Dashboard metrics update automatically every 2 seconds (Demo Mode)
      </p>
    </div>
  );
}

export default App;

