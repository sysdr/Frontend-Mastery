import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

// Fetch function for Active Users
const fetchActiveUsers = async () => {
    try {
        const res = await fetch('http://localhost:3001/api/metrics/active-users');
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            // Only log to console if it's not a temporary error (for debugging)
            if (errorData.error !== 'TEMPORARY_ERROR') {
                console.warn('Active Users API error:', errorData.message || 'Network error');
            }
            throw new Error(errorData.message || 'Network response was not ok for active users');
        }
        return res.json();
    } catch (error) {
        // Re-throw to let React Query handle retries
        throw error;
    }
};

// Fetch function for Daily Revenue
const fetchDailyRevenue = async () => {
    try {
        const res = await fetch('http://localhost:3001/api/metrics/daily-revenue');
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            // Only log to console if it's not a temporary error (for debugging)
            if (errorData.error !== 'TEMPORARY_ERROR') {
                console.warn('Daily Revenue API error:', errorData.message || 'Network error');
            }
            throw new Error(errorData.message || 'Network response was not ok for daily revenue');
        }
        return res.json();
    } catch (error) {
        // Re-throw to let React Query handle retries
        throw error;
    }
};

const DashboardMetrics = () => {
    const queryClient = useQueryClient();

    const { data: activeUsers, isLoading: activeUsersLoading, isError: activeUsersError, error: activeUsersErr, isFetching: activeUsersFetching, failureCount: activeUsersFailureCount } = useQuery({
        queryKey: ['dashboardMetrics', 'activeUsers'],
        queryFn: fetchActiveUsers,
        staleTime: 5000, // Data is fresh for 5 seconds
        retry: 3, // Retry up to 3 times
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
        refetchInterval: 5000, // Auto-refetch every 5 seconds
        // React Query v5 keeps previous data by default during refetches
    });

    const { data: dailyRevenue, isLoading: dailyRevenueLoading, isError: dailyRevenueError, error: dailyRevenueErr, isFetching: dailyRevenueFetching, failureCount: dailyRevenueFailureCount } = useQuery({
        queryKey: ['dashboardMetrics', 'dailyRevenue'],
        queryFn: fetchDailyRevenue,
        staleTime: 5000, // Data is fresh for 5 seconds
        retry: 3, // Retry up to 3 times
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
        refetchInterval: 5000, // Auto-refetch every 5 seconds
        // React Query v5 keeps previous data by default during refetches
    });

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['dashboardMetrics'] }); // Invalidate all queries starting with 'dashboardMetrics'
    };

    const isLoading = activeUsersLoading || dailyRevenueLoading;
    const isFetching = activeUsersFetching || dailyRevenueFetching;

    return (
        <div style={{
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            maxWidth: '500px',
            margin: '20px auto',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#f9f9f9',
            position: 'relative'
        }}>
            {isFetching && (
                <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    fontSize: '0.8em',
                    color: '#007bff',
                    fontWeight: 'bold'
                }}>
                    Fetching...
                </div>
            )}
            <h3 style={{ color: '#333', marginBottom: '15px' }}>Dashboard Metrics</h3>
            <div style={{ marginBottom: '10px', padding: '10px', border: '1px solid #eee', borderRadius: '5px', backgroundColor: '#fff' }}>
                {activeUsersLoading && !activeUsers ? (
                    <p>Loading Active Users...</p>
                ) : activeUsersError && activeUsersFailureCount >= 3 ? (
                    <div>
                        <p style={{ color: 'red', marginBottom: '5px' }}>⚠️ Error loading data (retrying...)</p>
                        {activeUsers?.value && (
                            <p><strong>Total Active Users:</strong> <span style={{ color: '#007bff', fontWeight: 'bold', opacity: 0.7 }}>{activeUsers.value.toLocaleString()} (last known)</span></p>
                        )}
                    </div>
                ) : (
                    <div>
                        <p><strong>Total Active Users:</strong> <span style={{ color: '#007bff', fontWeight: 'bold' }}>{activeUsers?.value?.toLocaleString() || 'N/A'}</span></p>
                        {activeUsersFetching && activeUsers && (
                            <p style={{ fontSize: '0.75em', color: '#666', marginTop: '5px' }}>Updating...</p>
                        )}
                    </div>
                )}
            </div>
            <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '5px', backgroundColor: '#fff' }}>
                {dailyRevenueLoading && !dailyRevenue ? (
                    <p>Loading Daily Revenue...</p>
                ) : dailyRevenueError && dailyRevenueFailureCount >= 3 ? (
                    <div>
                        <p style={{ color: 'red', marginBottom: '5px' }}>⚠️ Error loading data (retrying...)</p>
                        {dailyRevenue?.value && (
                            <p><strong>Daily Revenue:</strong> <span style={{ color: '#28a745', fontWeight: 'bold', opacity: 0.7 }}>${dailyRevenue.value.toLocaleString()} (last known)</span></p>
                        )}
                    </div>
                ) : (
                    <div>
                        <p><strong>Daily Revenue:</strong> <span style={{ color: '#28a745', fontWeight: 'bold' }}>${dailyRevenue?.value?.toLocaleString() || 'N/A'}</span></p>
                        {dailyRevenueFetching && dailyRevenue && (
                            <p style={{ fontSize: '0.75em', color: '#666', marginTop: '5px' }}>Updating...</p>
                        )}
                    </div>
                )}
            </div>
            <button
                onClick={handleRefresh}
                style={{
                    marginTop: '10px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '1em'
                }}
            >
                Refresh All Metrics
            </button>
            <p style={{ fontSize: '0.8em', color: '#666', marginTop: '15px' }}>
                Data revalidates every 5 seconds. Watch the "Fetching..." indicator.
            </p>
        </div>
    );
};

// Simple ErrorBoundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    border: '2px solid #dc3545',
                    padding: '20px',
                    margin: '20px',
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    borderRadius: '8px'
                }}>
                    <h2 style={{ color: '#dc3545' }}>Oops! Something went wrong.</h2>
                    <p>A critical component failed to render. We're working on it!</p>
                    <details style={{ whiteSpace: 'pre-wrap', marginTop: '15px', fontSize: '0.9em' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }
        return this.props.children;
    }
}

export default DashboardMetrics;
export { ErrorBoundary };
