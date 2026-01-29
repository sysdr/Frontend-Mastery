import React from 'react';
import { useAppStore } from '../store';

const NotificationPreference: React.FC = () => {
  const notificationsEnabled = useAppStore(state => state.notificationsEnabled);
  const toggleNotifications = useAppStore(state => state.toggleNotifications);

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', display: 'inline-block', marginLeft: '20px' }}>
      <span>Notifications: {notificationsEnabled ? 'Enabled' : 'Disabled'}</span>
      <button onClick={toggleNotifications} style={{ marginLeft: '10px', padding: '8px 15px', cursor: 'pointer' }}>
        Toggle Notifications
      </button>
    </div>
  );
};

export default NotificationPreference;
