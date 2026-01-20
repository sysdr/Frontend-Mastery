import React from 'react';
import Text from '../atoms/Text';

interface NavigationProps {
  onNavigate?: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'revenue', label: 'Revenue', icon: '💰' },
    { id: 'sessions', label: 'Sessions', icon: '🖥️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav className="space-y-2">
      <Text variant="heading3" className="mb-6 text-white">
        Navigation
      </Text>
      <ul className="space-y-1">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onNavigate?.(item.id)}
              className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center gap-3 text-gray-300 hover:text-white"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-8 pt-6 border-t border-gray-700">
        <Text variant="caption" className="text-gray-400 text-xs">
          SaaS Dashboard v1.0
        </Text>
      </div>
    </nav>
  );
};

export default Navigation;
