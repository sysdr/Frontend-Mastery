import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
      <h2 className="text-2xl font-bold mb-6">SaaS Dashboard</h2>
      <nav className="flex-grow">
        <ul>
          <li className="mb-2">
            <Link to="/dashboard" className="block p-2 rounded hover:bg-gray-700 transition-colors duration-200">Dashboard</Link>
          </li>
          <li className="mb-2">
            <Link to="/dashboard/settings" className="block p-2 rounded hover:bg-gray-700 transition-colors duration-200">Settings</Link>
          </li>
          <li className="mb-2">
            <Link to="/dashboard/profile" className="block p-2 rounded hover:bg-gray-700 transition-colors duration-200">Profile</Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-700">
        <p className="text-sm text-gray-400">© 2023 Acme Inc.</p>
      </div>
    </aside>
  );
};

export default Sidebar;
