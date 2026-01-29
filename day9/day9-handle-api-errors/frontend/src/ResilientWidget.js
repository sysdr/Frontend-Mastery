import React from 'react';
import { useResilientData } from './useResilientData';

function ResilientWidget() {
    const { data, loading, error, isFallback, refetch, log } = useResilientData('http://localhost:3001/api/data');

    const logEntryStyle = (type) => ({
        padding: '4px 8px',
        margin: '2px 0',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        ...(type === 'success' && { backgroundColor: '#d4edda', color: '#155724', borderLeft: '3px solid #28a745' }),
        ...(type === 'error' && { backgroundColor: '#f8d7da', color: '#721c24', borderLeft: '3px solid #dc3545' }),
        ...(type === 'retry' && { backgroundColor: '#fff3cd', color: '#856404', borderLeft: '3px solid #ffc107' }),
        ...(type === 'info' && { backgroundColor: '#e2e3e5', color: '#383d41', borderLeft: '3px solid #6c757d' }),
    });

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '500px', margin: '20px auto', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3>Resilient Dashboard Widget</h3>
            {loading && <p>Loading data...</p>}
            {error && !isFallback && (
                <p style={{ color: 'red' }}>Error: {error.message}. Please try refreshing.</p>
            )}
            {isFallback && (
                <p style={{ color: 'orange' }}>{data.message || 'Data is currently stale. Showing fallback information.'}</p>
            )}
            {!loading && data && (
                <div>
                    <p><strong>Status:</strong> {data.status}</p>
                    <p><strong>Value:</strong> {data.value}</p>
                    <p><strong>Last Updated:</strong> {new Date(data.timestamp).toLocaleTimeString()}</p>
                </div>
            )}
            <div style={{ marginTop: '16px' }}>
                <h4 style={{ marginBottom: '8px', fontSize: '14px' }}>Request log (success / failed)</h4>
                <div style={{ maxHeight: '180px', overflowY: 'auto', backgroundColor: '#f8f9fa', padding: '8px', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                    {log.length === 0 && <p style={{ fontSize: '12px', color: '#6c757d' }}>No entries yet.</p>}
                    {log.map((entry, i) => (
                        <div key={i} style={logEntryStyle(entry.type)} title={entry.time}>
                            <span style={{ opacity: 0.8, marginRight: '6px' }}>{entry.time}</span>
                            {entry.message}
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={refetch} disabled={loading} style={{ marginTop: '15px', padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
        </div>
    );
}

export default ResilientWidget;
