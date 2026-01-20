import React, { useState, useEffect } from 'react';
import DashboardLayout from '../templates/DashboardLayout';
import DashboardCard from '../organisms/DashboardCard';
import StatDisplay from '../molecules/StatDisplay';
import Text from '../atoms/Text';
import Navigation from '../organisms/Navigation';
import UserList from '../organisms/UserList';
import SalesReport from '../organisms/SalesReport';
import ActiveSessionsList from '../organisms/ActiveSessionsList';

const OverviewPage: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(12345);
  const [revenue, setRevenue] = useState(5678);
  const [activeSessions, setActiveSessions] = useState(890);
  const [activeView, setActiveView] = useState<'overview' | 'users' | 'sales' | 'sessions'>('overview');

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update users (small random changes)
      setTotalUsers(prev => prev + Math.floor(Math.random() * 5) - 2);
      
      // Update revenue (incremental growth)
      setRevenue(prev => prev + Math.floor(Math.random() * 50) + 10);
      
      // Update active sessions (fluctuating)
      setActiveSessions(prev => {
        const change = Math.floor(Math.random() * 20) - 10;
        return Math.max(100, prev + change);
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  const handleViewUserList = () => {
    setActiveView('users');
  };

  const handleViewSalesReport = () => {
    setActiveView('sales');
  };

  const handleViewActiveSessions = () => {
    setActiveView('sessions');
  };

  const handleCloseView = () => {
    setActiveView('overview');
  };

  const handleNavigate = (page: string) => {
    if (page === 'users') {
      setActiveView('users');
    } else if (page === 'revenue') {
      setActiveView('sales');
    } else if (page === 'sessions') {
      setActiveView('sessions');
    } else {
      setActiveView('overview');
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'users':
        return <UserList totalUsers={totalUsers} onClose={handleCloseView} />;
      case 'sales':
        return <SalesReport totalRevenue={revenue} onClose={handleCloseView} />;
      case 'sessions':
        return <ActiveSessionsList activeSessions={activeSessions} onClose={handleCloseView} />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <DashboardCard
              title="Total Users"
              footerActionText="View User List"
              onFooterAction={handleViewUserList}
            >
              <StatDisplay value={totalUsers.toLocaleString()} label="Registered Users" />
              <Text variant="body" className="mt-4">
                Insights into your user base.
              </Text>
            </DashboardCard>

            <DashboardCard
              title="Revenue Today"
              footerActionText="View Sales Report"
              onFooterAction={handleViewSalesReport}
            >
              <StatDisplay value={formatCurrency(revenue)} label="Today's Earnings" />
              <Text variant="body" className="mt-4">
                Real-time revenue figures.
              </Text>
            </DashboardCard>

            <DashboardCard
              title="Active Sessions"
              footerActionText="Monitor Live"
              onFooterAction={handleViewActiveSessions}
            >
              <StatDisplay value={activeSessions} label="Currently Online" />
              <Text variant="body" className="mt-4">
                Current active user sessions.
              </Text>
            </DashboardCard>
          </div>
        );
    }
  };

  return (
    <DashboardLayout
      header={<Text variant="heading2">Dashboard Overview</Text>}
      sidebar={<Navigation onNavigate={handleNavigate} />}
      content={renderContent()}
    />
  );
};

export default OverviewPage;
