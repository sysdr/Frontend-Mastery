import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h2>
      <p className="text-gray-700">View and edit your profile information.</p>
      <div className="mt-6 space-y-4">
        <div className="flex items-center">
          <label className="w-24 text-gray-700 font-medium">Name:</label>
          <input type="text" value="John Doe" readOnly className="flex-1 p-2 border rounded-md bg-gray-50" />
        </div>
        <div className="flex items-center">
          <label className="w-24 text-gray-700 font-medium">Email:</label>
          <input type="email" value="john.doe@example.com" readOnly className="flex-1 p-2 border rounded-md bg-gray-50" />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
