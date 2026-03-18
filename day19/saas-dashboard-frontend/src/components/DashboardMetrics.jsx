import React from 'react';

const DashboardMetrics = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm"><p className="text-slate-500 text-sm">Total Users</p><p className="text-2xl font-bold text-slate-800">0</p></div>
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm"><p className="text-slate-500 text-sm">Total Value</p><p className="text-2xl font-bold text-slate-800">0</p></div>
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm"><p className="text-slate-500 text-sm">Active</p><p className="text-2xl font-bold text-slate-800">0</p></div>
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm"><p className="text-slate-500 text-sm">Avg Value</p><p className="text-2xl font-bold text-slate-800">0</p></div>
      </div>
    );
  }
  const totalValue = data.reduce((sum, row) => sum + (row.value || 0), 0);
  const activeCount = data.filter(row => row.status === 'Active').length;
  const pendingCount = data.filter(row => row.status === 'Pending').length;
  const avgValue = (totalValue / data.length).toFixed(2);
  const metrics = [
    { label: 'Total Users', value: data.length, color: 'text-blue-600' },
    { label: 'Total Value', value: totalValue.toFixed(2), color: 'text-emerald-600' },
    { label: 'Active', value: activeCount, color: 'text-teal-600' },
    { label: 'Pending', value: pendingCount, color: 'text-amber-600' },
    { label: 'Avg Value', value: avgValue, color: 'text-orange-600' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {metrics.map((m) => (
        <div key={m.label} className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <p className="text-slate-500 text-sm uppercase tracking-wider">{m.label}</p>
          <p className={"text-2xl font-bold " + m.color}>{m.value}</p>
        </div>
      ))}
    </div>
  );
};
export default DashboardMetrics;
