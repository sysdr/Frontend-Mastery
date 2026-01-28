import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardMetrics, { ErrorBoundary } from './components/DashboardMetrics'; // Assuming DashboardMetrics.jsx is in src/components

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div style={{ fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', textAlign: 'center', padding: '20px', backgroundColor: '#eef2f7', minHeight: '100vh' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '30px' }}>📊 SaaS Dashboard Metrics</h1>
                <ErrorBoundary>
                    <DashboardMetrics />
                </ErrorBoundary>
            </div>
        </QueryClientProvider>
    );
}

export default App;
