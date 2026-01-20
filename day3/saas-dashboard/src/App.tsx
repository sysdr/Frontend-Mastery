import React, { useState, useEffect } from 'react';
import MetricCard from './components/MetricCard';
import Button from './components/Button';

interface DashboardMetrics {
  users: number;
  revenue: number;
  orders: number;
  conversionRate: number;
}

function App() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    users: 0,
    revenue: 0,
    orders: 0,
    conversionRate: 0,
  });
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoInterval, setDemoInterval] = useState<NodeJS.Timeout | null>(null);

  // Initialize with some default values
  useEffect(() => {
    setMetrics({
      users: 1247,
      revenue: 45230,
      orders: 892,
      conversionRate: 3.2,
    });
  }, []);

  const updateMetrics = () => {
    setMetrics((prev) => ({
      users: prev.users + Math.floor(Math.random() * 50) + 10,
      revenue: prev.revenue + Math.floor(Math.random() * 5000) + 500,
      orders: prev.orders + Math.floor(Math.random() * 20) + 5,
      conversionRate: parseFloat((Math.random() * 2 + 2.5).toFixed(2)),
    }));
  };

  const startDemo = () => {
    if (isDemoRunning) {
      // Stop demo
      if (demoInterval) {
        clearInterval(demoInterval);
        setDemoInterval(null);
      }
      setIsDemoRunning(false);
    } else {
      // Start demo
      setIsDemoRunning(true);
      const interval = setInterval(() => {
        updateMetrics();
      }, 2000); // Update every 2 seconds
      setDemoInterval(interval);
    }
  };

  const resetMetrics = () => {
    setMetrics({
      users: 1247,
      revenue: 45230,
      orders: 892,
      conversionRate: 3.2,
    });
  };

  useEffect(() => {
    return () => {
      if (demoInterval) {
        clearInterval(demoInterval);
      }
    };
  }, [demoInterval]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">SaaS Dashboard</h1>
          <p className="text-gray-600">Real-time metrics and analytics</p>
        </div>

        <div className="mb-6 flex gap-4">
          <Button
            variant={isDemoRunning ? 'danger' : 'primary'}
            onClick={startDemo}
          >
            {isDemoRunning ? 'Stop Demo' : 'Start Demo'}
          </Button>
          <Button variant="secondary" onClick={resetMetrics}>
            Reset Metrics
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Users"
            value={metrics.users}
            unit="users"
            trend="up"
            icon="👥"
          />
          <MetricCard
            title="Revenue"
            value={`$${metrics.revenue.toLocaleString()}`}
            trend="up"
            icon="💰"
          />
          <MetricCard
            title="Orders"
            value={metrics.orders}
            unit="orders"
            trend="up"
            icon="📦"
          />
          <MetricCard
            title="Conversion Rate"
            value={metrics.conversionRate}
            unit="%"
            trend="neutral"
            icon="📈"
          />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Status</h2>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Demo Status:</span>{' '}
              <span className={isDemoRunning ? 'text-green-600' : 'text-gray-500'}>
                {isDemoRunning ? 'Running' : 'Stopped'}
              </span>
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Metrics Update:</span>{' '}
              {isDemoRunning ? 'Updating every 2 seconds' : 'Static'}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">All Metrics:</span>{' '}
              <span className="text-green-600">Active and Updating</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
