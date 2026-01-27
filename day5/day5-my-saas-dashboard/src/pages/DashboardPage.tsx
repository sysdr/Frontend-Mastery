import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface Metrics {
  totalUsers: number;
  revenue: number;
  activeSessions: number;
  conversionRate: number;
  avgSessionDuration: number;
  pageViews: number;
}

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 1234,
    revenue: 56789,
    activeSessions: 456,
    conversionRate: 3.2,
    avgSessionDuration: 4.5,
    pageViews: 8923
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate real-time updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 10),
        revenue: prev.revenue + Math.floor(Math.random() * 500),
        activeSessions: Math.max(100, prev.activeSessions + Math.floor(Math.random() * 20 - 10)),
        conversionRate: Math.max(1.0, Math.min(10.0, prev.conversionRate + (Math.random() * 0.5 - 0.25))),
        avgSessionDuration: Math.max(1.0, Math.min(10.0, prev.avgSessionDuration + (Math.random() * 0.3 - 0.15))),
        pageViews: prev.pageViews + Math.floor(Math.random() * 50)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const runDemo = () => {
    setIsUpdating(true);
    // Simulate a demo that updates metrics significantly
    const demoInterval = setInterval(() => {
      setMetrics(prev => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 50),
        revenue: prev.revenue + Math.floor(Math.random() * 2000),
        activeSessions: Math.max(100, prev.activeSessions + Math.floor(Math.random() * 50 - 25)),
        conversionRate: Math.max(1.0, Math.min(10.0, prev.conversionRate + (Math.random() * 1.0 - 0.5))),
        avgSessionDuration: Math.max(1.0, Math.min(10.0, prev.avgSessionDuration + (Math.random() * 0.5 - 0.25))),
        pageViews: prev.pageViews + Math.floor(Math.random() * 200)
      }));
    }, 1000);

    setTimeout(() => {
      clearInterval(demoInterval);
      setIsUpdating(false);
    }, 10000); // Run demo for 10 seconds
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">SaaS Dashboard</h1>
        <Button
          onClick={runDemo}
          disabled={isUpdating}
          variant="primary"
        >
          {isUpdating ? 'Demo Running...' : 'Run Demo'}
        </Button>
      </div>

      <p className="text-gray-700">Real-time metrics and key performance indicators. Metrics update automatically every 5 seconds.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-6 rounded-md shadow-sm border border-blue-200">
          <div className="text-sm text-blue-600 font-medium mb-1">Total Users</div>
          <div className="text-3xl font-bold text-blue-900">{formatNumber(metrics.totalUsers)}</div>
          <div className="text-xs text-blue-600 mt-2">↗ +12% from last month</div>
        </div>
        
        <div className="bg-green-50 p-6 rounded-md shadow-sm border border-green-200">
          <div className="text-sm text-green-600 font-medium mb-1">Revenue</div>
          <div className="text-3xl font-bold text-green-900">{formatCurrency(metrics.revenue)}</div>
          <div className="text-xs text-green-600 mt-2">↗ +8% from last month</div>
        </div>
        
        <div className="bg-orange-50 p-6 rounded-md shadow-sm border border-orange-200">
          <div className="text-sm text-orange-600 font-medium mb-1">Active Sessions</div>
          <div className="text-3xl font-bold text-orange-900">{formatNumber(metrics.activeSessions)}</div>
          <div className="text-xs text-orange-600 mt-2">↗ +5% from last hour</div>
        </div>
        
        <div className="bg-purple-50 p-6 rounded-md shadow-sm border border-purple-200">
          <div className="text-sm text-purple-600 font-medium mb-1">Conversion Rate</div>
          <div className="text-3xl font-bold text-purple-900">{metrics.conversionRate.toFixed(2)}%</div>
          <div className="text-xs text-purple-600 mt-2">↗ +0.3% from last week</div>
        </div>
        
        <div className="bg-indigo-50 p-6 rounded-md shadow-sm border border-indigo-200">
          <div className="text-sm text-indigo-600 font-medium mb-1">Avg Session Duration</div>
          <div className="text-3xl font-bold text-indigo-900">{metrics.avgSessionDuration.toFixed(1)} min</div>
          <div className="text-xs text-indigo-600 mt-2">↗ +0.2 min from last week</div>
        </div>
        
        <div className="bg-pink-50 p-6 rounded-md shadow-sm border border-pink-200">
          <div className="text-sm text-pink-600 font-medium mb-1">Page Views</div>
          <div className="text-3xl font-bold text-pink-900">{formatNumber(metrics.pageViews)}</div>
          <div className="text-xs text-pink-600 mt-2">↗ +15% from last hour</div>
        </div>
      </div>
      
      {isUpdating && (
        <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-md text-blue-800 text-sm">
          ⚡ Demo mode active: Metrics are updating rapidly for demonstration purposes...
        </div>
      )}

      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-semibold text-gray-700">UI Components Demo</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Button onClick={() => alert('Primary Button clicked!')}>Primary Button</Button>
            <Button variant="secondary" onClick={() => alert('Secondary Button clicked!')}>Secondary Button</Button>
            <Button variant="danger" onClick={() => alert('Danger Button clicked!')}>Danger Button</Button>
            <Button variant="ghost" onClick={() => alert('Ghost Button clicked!')}>Ghost Button</Button>
            <Button size="small" onClick={() => alert('Small Button clicked!')}>Small Button</Button>
            <Button size="large" loading>Loading Large Button</Button>
            <Button disabled>Disabled Button</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="text-input" className="block text-sm font-medium text-gray-700">Text Input</label>
            <Input
              id="text-input"
              placeholder="Enter text here"
              defaultValue="siddhi"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email-input" className="block text-sm font-medium text-gray-700">Email Input</label>
            <Input
              id="email-input"
              type="email"
              placeholder="your@example.com"
              defaultValue="user@gmail.com"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
