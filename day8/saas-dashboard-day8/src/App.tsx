import { useQuery } from '@tanstack/react-query';
import { fetchAllMetrics } from './api/metrics';
import MetricCard from './components/MetricCard';
import './index.css';

function App() {
  const { data: metrics, isLoading, isError, error } = useQuery({
    queryKey: ['metrics'],
    queryFn: fetchAllMetrics,
  });

  if (isLoading) return <div className="dashboard-container">Loading dashboard metrics...</div>;
  if (isError) return <div className="dashboard-container error-message">Error: {error?.message || 'Failed to fetch metrics'}</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">SaaS Dashboard - Day 8: Optimistic Updates</h1>
      <p className="dashboard-subtitle">Click a metric's toggle button to see optimistic updates in action. Watch for immediate UI changes and potential rollbacks on simulated API failure.</p>
      <div className="metrics-grid">
        {metrics && metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}

export default App;
