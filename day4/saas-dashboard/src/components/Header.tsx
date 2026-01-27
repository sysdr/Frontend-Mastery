import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Welcome Back!</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">John Doe</span>
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">JD</div>
      </div>
    </header>
  );
};

export default Header;
