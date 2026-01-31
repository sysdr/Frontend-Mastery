import { useState, useCallback } from 'react';
import DashboardGrid from './components/DashboardGrid';
import MetricWidget from './components/MetricWidget';
import './App.css';

interface EventLog {
  time: string;
  type: 'spike' | 'reset' | 'pause' | 'resume';
  message: string;
}

function App() {
  const [isPaused, setIsPaused] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [spikeMultiplier, setSpikeMultiplier] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const [events, setEvents] = useState<EventLog[]>([]);

  const getTime = () => new Date().toLocaleTimeString();

  const addEvent = useCallback((type: EventLog['type'], message: string) => {
    setEvents(prev => [{time: getTime(), type, message}, ...prev.slice(0, 9)]);
  }, []);

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
    addEvent(isPaused ? 'resume' : 'pause', isPaused ? 'Updates resumed' : 'Updates paused');
  };

  const handleReset = () => {
    setResetKey(prev => prev + 1);
    setSpikeMultiplier(1);
    addEvent('reset', 'All metrics reset to initial values');
  };

  const handleSpike = () => {
    setSpikeMultiplier(prev => prev * 1.5);
    addEvent('spike', `Traffic spike simulated! Values increased by 50%`);
  };

  const handleCrash = () => {
    setSpikeMultiplier(0.3);
    addEvent('spike', 'Market crash simulated! Values dropped by 70%');
  };

  return (
    <div className="App">
      <header className="dashboard-header">
        <h1>SaaS Analytics Dashboard</h1>
        <p className="subtitle">Real-time metrics with live updates</p>
      </header>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-item">
          <span className={`status-dot ${isPaused ? 'paused' : 'live'}`}></span>
          <span>{isPaused ? 'Paused' : 'Live Updates'}</span>
        </div>
        <div className="status-item">
          <span>Multiplier: {spikeMultiplier.toFixed(1)}x</span>
        </div>
        <div className="status-item">
          <span>Last refresh: {getTime()}</span>
        </div>
      </div>

      {/* Info Section */}
      {showInfo && (
        <div className="info-section">
          <h2>Welcome to the Real-Time Analytics Dashboard</h2>
          <p>
            This dashboard demonstrates <strong>real-time data visualization</strong> with automatic updates. 
            Each metric card simulates live business data that updates at different intervals.
          </p>
          <ul>
            <li><strong>Trend Arrows:</strong> ↑ (increasing), ↓ (decreasing), → (stable)</li>
            <li><strong>Color Coding:</strong> Green = positive trend, Pink = negative trend</li>
            <li><strong>Live Updates:</strong> Values change automatically every 1.5-10 seconds</li>
          </ul>
          <p><strong>Try the controls below</strong> to interact with the data!</p>
          <button className="info-toggle" onClick={() => setShowInfo(false)}>
            Got it, hide this
          </button>
        </div>
      )}

      {/* Control Panel */}
      <div className="control-panel">
        <button className={`control-btn ${isPaused ? 'success' : 'warning'}`} onClick={handlePauseResume}>
          {isPaused ? '▶ Resume' : '⏸ Pause'} Updates
        </button>
        <button className="control-btn primary" onClick={handleReset}>
          ↺ Reset All
        </button>
        <button className="control-btn info" onClick={handleSpike}>
          📈 Simulate Spike
        </button>
        <button className="control-btn danger" onClick={handleCrash}>
          📉 Simulate Crash
        </button>
        {!showInfo && (
          <button className="control-btn primary" onClick={() => setShowInfo(true)}>
            ℹ Show Info
          </button>
        )}
      </div>

      {/* Event Log */}
      {events.length > 0 && (
        <div className="event-log">
          <div className="event-log-title">Event Log</div>
          {events.map((event, i) => (
            <div key={i} className="event-item">
              <span className="event-time">{event.time}</span>
              <span className={`event-type ${event.type}`}>{event.type.toUpperCase()}</span>
              <span>{event.message}</span>
            </div>
          ))}
        </div>
      )}

      <DashboardGrid>
        <MetricWidget 
          key={`sales-${resetKey}`}
          title="Total Sales" 
          initialValue={124500 * spikeMultiplier} 
          prefix="$"
          trend="up"
          updateInterval={2500}
          isPaused={isPaused}
        />
        <MetricWidget 
          key={`revenue-${resetKey}`}
          title="Monthly Revenue" 
          initialValue={89340 * spikeMultiplier} 
          prefix="$"
          trend="up"
          updateInterval={3000}
          isPaused={isPaused}
        />
        <MetricWidget 
          key={`users-${resetKey}`}
          title="Active Users" 
          initialValue={2847 * spikeMultiplier} 
          trend="up"
          updateInterval={2000}
          isPaused={isPaused}
        />
        <MetricWidget 
          key={`conversion-${resetKey}`}
          title="Conversion Rate" 
          initialValue={Math.min(3.24 * spikeMultiplier, 15)} 
          unit="%"
          trend="up"
          updateInterval={4000}
          isPaused={isPaused}
        />
        <MetricWidget 
          key={`tickets-${resetKey}`}
          title="Support Tickets" 
          initialValue={47 * spikeMultiplier} 
          trend="down"
          updateInterval={5000}
          isPaused={isPaused}
        />
        <MetricWidget 
          key={`uptime-${resetKey}`}
          title="System Uptime" 
          initialValue={Math.min(99.97, 99.97 * (spikeMultiplier > 1 ? 1 : spikeMultiplier + 0.003))} 
          unit="%"
          trend="neutral"
          updateInterval={10000}
          isPaused={isPaused}
          maxValue={100}
        />
        <MetricWidget 
          key={`views-${resetKey}`}
          title="Page Views" 
          initialValue={156780 * spikeMultiplier} 
          trend="up"
          updateInterval={1500}
          isPaused={isPaused}
        />
        <MetricWidget 
          key={`orders-${resetKey}`}
          title="Orders Today" 
          initialValue={342 * spikeMultiplier} 
          trend="up"
          updateInterval={2000}
          isPaused={isPaused}
        />
      </DashboardGrid>
    </div>
  );
}

export default App;
