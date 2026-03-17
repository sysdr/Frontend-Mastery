import React from 'react';
import type { ViewId } from './DashboardLayout';

interface SidebarProps {
  isOpen: boolean;
  activeView: ViewId;
  onNavigate: (view: ViewId) => void;
}

const navItems: { id: ViewId; label: string; svgPath: string }[] = [
  { id: 'overview', label: 'Overview', svgPath: 'M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z M11 7h2v4h4v2h-4v4h-2v-4H7v-2h4z' },
  { id: 'analytics', label: 'Analytics', svgPath: 'M13 14H7v-2h6v2zm0-4H7V8h6v2zm7-6H4c-1.103 0-2 .897-2 2v16c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 18H4V6h16v16z' },
  { id: 'reports', label: 'Reports', svgPath: 'M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z' },
  { id: 'settings', label: 'Settings', svgPath: 'M19.937 8.674l-6.042-6.042a.997.997 0 0 0-1.414 0L6.437 8.674a2.997 2.997 0 0 0-.877 2.122V20a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9.204c0-.79-.318-1.547-.877-2.122zM18 20H8v-9.204l5-5 5 5V20z' },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeView, onNavigate }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <nav className="sidebar-nav">
        <ul className="sidebar-nav">
          {navItems.map(({ id, label, svgPath }) => (
            <li key={id} className="sidebar-nav-item">
              <button
                type="button"
                className={`sidebar-nav-link ${activeView === id ? 'active' : ''}`}
                onClick={() => onNavigate(id)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path d={svgPath}></path></svg>
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
