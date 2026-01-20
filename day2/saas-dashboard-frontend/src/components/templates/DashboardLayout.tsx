import React from 'react';

interface DashboardLayoutProps {
  header: React.ReactNode;
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ header, sidebar, content }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-gray-800 text-white p-4">
        {sidebar}
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4">
          {header}
        </header>
        <main className="flex-1 p-6">
          {content}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
