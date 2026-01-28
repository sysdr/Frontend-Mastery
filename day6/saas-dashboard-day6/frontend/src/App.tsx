
import React from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Data is always considered stale for real-time updates
      cacheTime: 1000 * 60 * 5, // Data will be removed from cache after 5 minutes if not used
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnMount: true, // Refetch when component mounts
      refetchInterval: 3000, // Refetch every 3 seconds for real-time updates
    },
  },
});

// Our data fetching function
const fetchDashboardMetrics = async () => {
  const response = await fetch("http://localhost:3001/api/v1/metrics");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

function DashboardMetricsDisplay() {
  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: fetchDashboardMetrics,
    refetchInterval: 3000, // Refetch every 3 seconds for real-time updates
  });

  if (isLoading) return <div style={{ padding: "20px", fontSize: "1.2em", color: "#007bff" }}>Loading dashboard metrics...</div>;
  if (isError) return <div style={{ padding: "20px", fontSize: "1.2em", color: "#dc3545" }}>Error: {error.message}</div>;

  return (
    <div style={{
      fontFamily: "Arial, sans-serif",
      padding: "30px",
      maxWidth: "600px",
      margin: "50px auto",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      borderRadius: "8px",
      backgroundColor: "#f8f9fa"
    }}>
      <h2 style={{ color: "#343a40", borderBottom: "2px solid #007bff", paddingBottom: "10px" }}>
        Dashboard Overview {isFetching ? <span style={{ fontSize: "0.8em", color: "#6c757d" }}>(Refreshing...)</span> : ""}
      </h2>
      <p style={{ fontSize: "1.1em", marginBottom: "10px" }}>
        <strong>Total Users:</strong> <span style={{ color: "#28a745" }}>{data.totalUsers.toLocaleString()}</span>
      </p>
      <p style={{ fontSize: "1.1em", marginBottom: "10px" }}>
        <strong>Active Sessions:</strong> <span style={{ color: "#ffc107" }}>{data.activeSessions.toLocaleString()}</span>
      </p>
      <p style={{ fontSize: "1.1em", marginBottom: "10px" }}>
        <strong>New Signups Today:</strong> <span style={{ color: "#17a2b8" }}>{data.newSignupsToday}</span>
      </p>
      <p style={{ fontSize: "1.1em", marginBottom: "10px" }}>
        <strong>Monthly Revenue:</strong> <span style={{ color: "#6f42c1" }}>${data.revenueMonth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </p>
      <p style={{ fontSize: "1.1em", marginBottom: "10px" }}>
        <strong>Conversion Rate:</strong> <span style={{ color: "#fd7e14" }}>{(data.conversionRate * 100).toFixed(2)}%</span>
      </p>
      <p style={{ fontSize: "0.9em", color: "#6c757d", marginTop: "20px" }}>
        Last Updated: {new Date(data.lastUpdated).toLocaleTimeString()}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardMetricsDisplay />
    </QueryClientProvider>
  );
}

