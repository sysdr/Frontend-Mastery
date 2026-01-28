const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simulate active users metric
app.get('/api/metrics/active-users', (req, res) => {
    // 5% chance of failure to demonstrate resilience (reduced from 20% for better UX)
    if (Math.random() < 0.05) {
        console.warn('[Backend] Simulated error: Failed to fetch active users (this is intentional to test retry logic)');
        return res.status(500).json({ 
            message: 'Internal Server Error: Failed to fetch active users',
            error: 'TEMPORARY_ERROR' // Indicate this is a temporary error that should be retried
        });
    }
    const value = Math.floor(Math.random() * 100000) + 50000; // 50,000 to 150,000
    console.log(`[Backend] Serving active users: ${value}`);
    res.json({ value });
});

// Simulate daily revenue metric
app.get('/api/metrics/daily-revenue', (req, res) => {
    // 5% chance of failure to demonstrate resilience (reduced from 15% for better UX)
    if (Math.random() < 0.05) {
        console.warn('[Backend] Simulated error: Failed to fetch daily revenue (this is intentional to test retry logic)');
        return res.status(500).json({ 
            message: 'Internal Server Error: Failed to fetch daily revenue',
            error: 'TEMPORARY_ERROR' // Indicate this is a temporary error that should be retried
        });
    }
    const value = Math.floor(Math.random() * 50000) + 10000; // 10,000 to 60,000
    console.log(`[Backend] Serving daily revenue: ${value}`);
    res.json({ value });
});

app.get('/', (req, res) => {
  res.send('Backend API is running!');
});

app.listen(port, () => {
    console.log(`Backend API listening at http://localhost:${port}`);
});
