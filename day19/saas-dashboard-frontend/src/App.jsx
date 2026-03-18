import React from 'react';
import DataTable from './components/DataTable';
import DashboardMetrics from './components/DashboardMetrics';
import { generateMockData } from './data/mockData';
import './index.css';

const App = () => {
  const data = generateMockData(1000);

  const columns = [
    { key: 'id', header: 'ID', sortable: true },
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email', sortable: false },
    { key: 'status', header: 'Status', sortable: true },
    { key: 'createdAt', header: 'Created At', sortable: true },
    { key: 'value', header: 'Value', sortable: true },
    { key: 'category', header: 'Category', sortable: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-8">
      <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">SaaS Dashboard: Dynamic Data Tables</h1>
      <DashboardMetrics data={data} />
      <DataTable columns={columns} initialData={data} itemsPerPage={20} />
    </div>
  );
};

export default App;
