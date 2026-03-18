import React, { useState, useMemo } from 'react';
import SearchInput from './components/SearchInput';
import FilterDropdown from './components/FilterDropdown';
import DataTable from './components/DataTable';
import './index.css';

const generateSampleData = (count) => {
  const data = [];
  const statuses = ['Active', 'Pending', 'Completed', 'Cancelled'];
  const types = ['Feature', 'Bug', 'Task', 'Improvement'];
  for (let i = 1; i <= count; i++) {
    data.push({
      id: i,
      name: `Task ${i} - ${Math.random().toString(36).substring(7)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      type: types[Math.floor(Math.random() * types.length)],
      priority: Math.floor(Math.random() * 3) + 1,
      createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toLocaleDateString(),
    });
  }
  return data;
};

const ALL_TASKS = generateSampleData(50);

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'type', label: 'Type' },
  { key: 'priority', label: 'Priority' },
  { key: 'createdAt', label: 'Created At' },
];

const statusFilterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'Active' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Cancelled', value: 'Cancelled' },
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const filteredData = useMemo(() => {
    let result = ALL_TASKS;
    if (selectedStatus !== 'all') {
      result = result.filter(item => item.status === selectedStatus);
    }
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      result = result.filter(item =>
        columns.some(col =>
          String(item[col.key]).toLowerCase().includes(lowerCaseSearchTerm)
        )
      );
    }
    return result;
  }, [searchTerm, selectedStatus]);

  const metrics = useMemo(() => ({
    total: filteredData.length,
    active: filteredData.filter(t => t.status === 'Active').length,
    pending: filteredData.filter(t => t.status === 'Pending').length,
    completed: filteredData.filter(t => t.status === 'Completed').length,
    cancelled: filteredData.filter(t => t.status === 'Cancelled').length,
  }), [filteredData]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Task Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="text-sm font-medium text-gray-500">Total (filtered)</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <p className="text-sm font-medium text-gray-500">Active</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.active}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-emerald-500">
          <p className="text-sm font-medium text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <p className="text-sm font-medium text-gray-500">Cancelled</p>
          <p className="text-2xl font-bold text-gray-900">{metrics.cancelled}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <SearchInput onSearch={setSearchTerm} />
        <FilterDropdown
          label="Status"
          options={statusFilterOptions}
          selectedValue={selectedStatus}
          onSelect={setSelectedStatus}
        />
      </div>

      <DataTable data={filteredData} columns={columns} />
    </div>
  );
}

export default App;
