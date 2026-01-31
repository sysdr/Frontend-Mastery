import type { ReactNode } from 'react';
import './DashboardGrid.css';

interface DashboardGridProps {
  children: ReactNode;
}

const DashboardGrid = ({ children }: DashboardGridProps) => {
  return (
    <div className="dashboard-grid-container">
      {children}
    </div>
  );
};

export default DashboardGrid;
