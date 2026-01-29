const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/data', (req, res) => {
    if (Math.random() < 0.3) {
        console.log('[Backend] Simulating 500 Internal Server Error');
        return res.status(500).json({ error: 'Internal Server Error', timestamp: new Date().toISOString() });
    }
    console.log('[Backend] Simulating 200 OK');
    res.json({
        status: 'success',
        message: 'Dashboard data loaded!',
        value: Math.floor(Math.random() * 1000),
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log('[Backend] API running on http://localhost:' + PORT);
});
