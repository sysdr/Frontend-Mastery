import React from 'react';
import { useAppStore } from '../store';

const ThemeToggle: React.FC = () => {
  const theme = useAppStore(state => state.theme);
  const toggleTheme = useAppStore(state => state.toggleTheme);

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px', display: 'inline-block' }}>
      <span>Current Theme: {theme.toUpperCase()}</span>
      <button onClick={toggleTheme} style={{ marginLeft: '10px', padding: '8px 15px', cursor: 'pointer' }}>
        Toggle Theme
      </button>
    </div>
  );
};

export default ThemeToggle;
