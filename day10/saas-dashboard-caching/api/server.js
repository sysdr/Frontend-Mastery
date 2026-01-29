const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());

let metricsData = [
    { id: 'CPU', value: 70 },
    { id: 'Memory', value: 65 },
    { id: 'Network', value: 120 }
];

app.get('/api/metrics', (req, res) => {
    setTimeout(() => {
        metricsData = metricsData.map(metric => ({
            ...metric,
            value: Math.min(100, Math.max(0, metric.value + Math.floor(Math.random() * 5) - 2))
        }));
        res.json(metricsData);
    }, 1500); // Simulate 1.5 seconds latency
});

app.listen(port, () => {
    console.log(`Metrics API listening at http://localhost:${port}`);
});
