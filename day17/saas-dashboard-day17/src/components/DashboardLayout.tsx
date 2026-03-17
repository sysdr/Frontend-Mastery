import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

export type ViewId = 'overview' | 'analytics' | 'reports' | 'settings';

const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<ViewId>('overview');

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="dashboard-layout">
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className={`main-section ${isSidebarOpen ? '' : 'sidebar-closed'}`}>
        <Sidebar isOpen={isSidebarOpen} activeView={activeView} onNavigate={setActiveView} />
        <MainContent isSidebarOpen={isSidebarOpen} activeView={activeView} />
      </div>
    </div>
  );
};

export default DashboardLayout;
