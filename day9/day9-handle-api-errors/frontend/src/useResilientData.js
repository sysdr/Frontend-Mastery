import { useState, useEffect, useCallback } from 'react';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500;

const defaultFallbackData = {
    status: 'fallback',
    message: 'Could not fetch live data. Showing fallback information.',
    value: 'N/A',
    timestamp: 'Stale'
};

const fetchWithRetries = async (url, options = {}, retries = MAX_RETRIES, onAttempt) => {
    let attempt = 0;
    while (attempt < retries + 1) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                if (response.status >= 500) {
                    onAttempt && onAttempt({ attempt: attempt + 1, success: false, statusCode: response.status, message: `Server error: ${response.status}` });
                    throw new Error(`Server error: ${response.status}`);
                }
                onAttempt && onAttempt({ attempt: attempt + 1, success: false, statusCode: response.status, message: `Client error: ${response.status}` });
                throw new Error(`Client error: ${response.status}`);
            }
            const json = await response.json();
            onAttempt && onAttempt({ attempt: attempt + 1, success: true, statusCode: 200, message: 'OK', value: json.value, timestamp: json.timestamp });
            return json;
        } catch (error) {
            console.warn(`[Frontend] Attempt ${attempt + 1} failed: ${error.message}`);
            if (attempt < retries && error.message.includes('Server error')) {
                const delay = Math.pow(2, attempt) * BASE_DELAY_MS + Math.random() * BASE_DELAY_MS;
                onAttempt && onAttempt({ attempt: attempt + 1, success: false, retrying: true, delayMs: Math.round(delay) });
                console.log(`[Frontend] Retrying in ${delay.toFixed(0)}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                attempt++;
            } else {
                onAttempt && onAttempt({ attempt: attempt + 1, success: false, message: error.message, exhausted: true });
                throw error;
            }
        }
    }
    throw new Error('Max retries exhausted');
};

export const useResilientData = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFallback, setIsFallback] = useState(false);
    const [log, setLog] = useState([]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        setIsFallback(false);
        setLog(prev => [...prev, { type: 'info', message: 'Fetch started', time: new Date().toLocaleTimeString() }]);
        try {
            const fetchedData = await fetchWithRetries(url, {}, MAX_RETRIES, (entry) => {
                const time = new Date().toLocaleTimeString();
                if (entry.success) {
                    setLog(prev => [...prev, { type: 'success', message: `Attempt ${entry.attempt}: Success (HTTP ${entry.statusCode}) — value: ${entry.value}`, time }]);
                } else if (entry.retrying) {
                    setLog(prev => [...prev, { type: 'retry', message: `Attempt ${entry.attempt}: Failed — retrying in ~${entry.delayMs}ms...`, time }]);
                } else if (entry.exhausted) {
                    setLog(prev => [...prev, { type: 'error', message: `Attempt ${entry.attempt}: Failed — ${entry.message}. Using fallback.`, time }]);
                } else {
                    setLog(prev => [...prev, { type: 'error', message: `Attempt ${entry.attempt}: Failed (HTTP ${entry.statusCode}) — ${entry.message || ''}`, time }]);
                }
            });
            setData(fetchedData);
        } catch (err) {
            console.error('[Frontend] Failed to fetch data after retries:', err);
            setError(err);
            setData(defaultFallbackData);
            setIsFallback(true);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, isFallback, refetch: fetchData, log };
};
