import React, { useState, useCallback } from 'react';
import './App.css';
import DataCard from './components/DataCard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Navigation from './components/Navigation';

const initialMetrics = {
  users: { value: '1.2M', trend: 5.2 },
  revenue: { value: '$25,345', trend: -1.3 },
  session: { value: '3:15', unit: 'min', trend: 0.8 },
  load: { value: '72', unit: '%', trend: 2.1 },
};

function formatRevenue(n) {
  return '$' + Math.round(n).toLocaleString();
}
function formatTime(mins) {
  const m = Math.floor(mins);
  const s = Math.round((mins - m) * 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function App() {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [demoRunning, setDemoRunning] = useState(false);

  const handleCardClick = (title) => {
    console.log('Data Card "' + title + '" was clicked!');
    alert('You clicked on: ' + title);
  };

  const runDemo = useCallback(() => {
    if (demoRunning) return;
    setDemoRunning(true);
    const baseUsers = 1200000;
    const baseRevenue = 25345;
    const baseSession = 3.25;
    const baseLoad = 72;
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const t = step * 0.5;
      setMetrics({
        users: {
          value: ((baseUsers * (1 + 0.02 * Math.sin(t))) / 1e6).toFixed(2) + 'M',
          trend: 5.2 + Math.sin(t) * 2,
        },
        revenue: {
          value: formatRevenue(baseRevenue * (1 + 0.03 * Math.sin(t + 1))),
          trend: -1.3 + Math.cos(t) * 1.5,
        },
        session: {
          value: formatTime(baseSession + 0.1 * Math.sin(t + 2)),
          unit: 'min',
          trend: 0.8 + Math.sin(t * 0.7) * 0.5,
        },
        load: {
          value: String(Math.round(baseLoad + 5 * Math.sin(t + 3))),
          unit: '%',
          trend: 2.1 + Math.cos(t * 0.5) * 1,
        },
      });
      if (step >= 20) {
        clearInterval(interval);
        setDemoRunning(false);
      }
    }, 800);
  }, [demoRunning]);

  return (
    <div className="dashboard-app">
      <Header />
      <Sidebar />
      <div className="main-content">
        <Navigation />
        <section className="project-info" aria-label="Project information">
          <h2 className="project-info__title">What this project is about</h2>
          <p className="project-info__desc">
            <strong>Day 18 — Operations Dashboard:</strong> This project demonstrates a reusable <strong>Data Card</strong> component for showing metrics with trend indicators (up/down). The dashboard displays operations-style KPIs (sessions, revenue, server load). Cards are clickable for details. Use <strong>Run Demo</strong> to simulate live metric updates and see the Data Card component in action.
          </p>
        </section>
        <div className="demo-controls">
          <button
            type="button"
            className="demo-button"
            onClick={runDemo}
            disabled={demoRunning}
            aria-label="Run demo to update dashboard metrics"
          >
            {demoRunning ? 'Demo running…' : 'Run Demo'}
          </button>
        </div>
        <section className="dashboard-section" aria-label="Key operations metrics">
          <h3 className="dashboard-section__title">Key operations metrics</h3>
        <div className="dashboard-grid">
          <DataCard
            title="Active Sessions"
            value={metrics.users.value}
            unit=""
            trend={metrics.users.trend}
            icon="👥"
            onClick={() => handleCardClick('Active Sessions')}
          />
          <DataCard
            title="Revenue Today"
            value={metrics.revenue.value}
            unit=""
            trend={metrics.revenue.trend}
            icon="💰"
            onClick={() => handleCardClick('Revenue Today')}
          />
          <DataCard
            title="Avg. Session"
            value={metrics.session.value}
            unit={metrics.session.unit}
            trend={metrics.session.trend}
            icon="⏱️"
            onClick={() => handleCardClick('Avg. Session')}
          />
          <DataCard
            title="Server Load"
            value={metrics.load.value}
            unit={metrics.load.unit}
            trend={metrics.load.trend}
            icon="⚡"
            onClick={() => handleCardClick('Server Load')}
          />
        </div>
        </section>
      </div>
    </div>
  );
}

export default App;
