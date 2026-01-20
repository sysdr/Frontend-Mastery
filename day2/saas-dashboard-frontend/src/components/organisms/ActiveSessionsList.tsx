import React from 'react';
import Text from '../atoms/Text';
import Button from '../atoms/Button';

interface Session {
  id: number;
  userId: string;
  ipAddress: string;
  location: string;
  device: string;
  duration: string;
  lastActivity: string;
}

interface ActiveSessionsListProps {
  activeSessions: number;
  onClose: () => void;
}

const ActiveSessionsList: React.FC<ActiveSessionsListProps> = ({ activeSessions, onClose }) => {
  // Generate sample sessions
  const sessions: Session[] = Array.from({ length: Math.min(10, activeSessions) }, (_, i) => ({
    id: i + 1,
    userId: `user_${1000 + i}`,
    ipAddress: `192.168.1.${100 + i}`,
    location: ['New York', 'London', 'Tokyo', 'Sydney', 'Berlin'][i % 5],
    device: ['Desktop', 'Mobile', 'Tablet'][i % 3],
    duration: `${Math.floor(Math.random() * 120) + 5} min`,
    lastActivity: new Date(Date.now() - Math.random() * 300000).toLocaleTimeString(),
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Text variant="heading2">Active Sessions Monitor</Text>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
      <div className="mb-4">
        <Text variant="body" className="text-gray-600">
          Currently Online: <span className="font-bold text-blue-600">{activeSessions}</span>
        </Text>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sessions.map((session) => (
              <tr key={session.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{session.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{session.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.ipAddress}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.device}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.duration}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.lastActivity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveSessionsList;
