import { useState, useEffect } from 'react';
import useSWR from 'swr';
import fetcher from '../utils/fetcher';

const API_URL = 'http://localhost:3001/api/metrics';

const MetricsWidget = ({ onRefresh }) => {
  const [mounted, setMounted] = useState(false);
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    mounted ? API_URL : null,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: mounted ? 2500 : 0,
    }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRefresh = () => {
    mutate();
    onRefresh?.();
  };

  // Same structure on server and initial client to avoid hydration mismatch.
  const wrapperClass = 'bg-white p-6 rounded-xl shadow-lg border border-slate-200 w-full max-w-md';

  if (!mounted) {
    return (
      <div className={wrapperClass}>
        <div className="text-slate-500 p-4 animate-pulse">Loading metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={wrapperClass}>
        <div className="text-red-500 p-4">Failed to load metrics.</div>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className={wrapperClass}>
        <div className="text-slate-500 p-4 animate-pulse">Loading metrics...</div>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Live Metrics</h2>
        <button
          type="button"
          onClick={handleRefresh}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
        >
          Refresh now
        </button>
      </div>
      {isValidating && (
        <p className="text-sm text-indigo-500 mb-2 animate-pulse">Updating...</p>
      )}
      <ul className="space-y-3">
        {data?.map((metric) => (
          <li
            key={metric.id}
            className="flex justify-between items-center py-2 border-b last:border-b-0 border-slate-100"
          >
            <span className="text-lg font-medium text-slate-700">{metric.id}</span>
            <span
              className={`text-xl font-extrabold tabular-nums ${
                metric.value > 80 ? 'text-red-600' : 'text-green-600'
              }`}
            >
              {metric.value}%
            </span>
          </li>
        ))}
      </ul>
      {data && (
        <p className="mt-3 text-xs text-slate-400">
          Real-time: auto-refresh every 2.5s
        </p>
      )}
      {!data && !isLoading && <p className="text-slate-500 p-4">No metrics available.</p>}
    </div>
  );
};

export default MetricsWidget;
