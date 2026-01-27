import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Settings</h2>
      <p className="text-gray-700">Manage your application settings here.</p>
      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-gray-700 font-medium">Email Notifications:</span>
          <input type="checkbox" className="ml-2 form-checkbox text-blue-600" defaultChecked />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Theme:</span>
          <select className="ml-2 form-select mt-1 block w-48 rounded-md border-gray-300 shadow-sm">
            <option>Light</option>
            <option>Dark</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default SettingsPage;
