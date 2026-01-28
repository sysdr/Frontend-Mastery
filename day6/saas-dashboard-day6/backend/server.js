
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(cors()); // Enable CORS for frontend to access

// Root route - provide API information
app.get("/", (req, res) => {
    res.json({
        message: "SaaS Dashboard Backend API",
        version: "1.0.0",
        endpoints: {
            metrics: "/api/v1/metrics"
        }
    });
});

// Base metrics - will be modified to simulate real-time updates
let baseMetrics = {
    totalUsers: 123456,
    activeSessions: 7890,
    newSignupsToday: 152,
    revenueMonth: 89123.45,
    conversionRate: 0.042
};

app.get("/api/v1/metrics", (req, res) => {
    // Simulate real-time updates by slightly varying metrics on each request
    const now = new Date();
    const timeVariation = Math.sin(now.getTime() / 10000) * 0.1; // Slow oscillation
    
    // Generate dynamic metrics that change slightly each time
    const metrics = {
        totalUsers: Math.floor(baseMetrics.totalUsers + Math.random() * 5 + timeVariation * 100),
        activeSessions: Math.floor(baseMetrics.activeSessions + Math.random() * 20 - 10 + timeVariation * 50),
        newSignupsToday: Math.floor(baseMetrics.newSignupsToday + Math.random() * 3 - 1),
        revenueMonth: baseMetrics.revenueMonth + Math.random() * 10 - 5 + timeVariation * 50,
        conversionRate: Math.max(0.03, Math.min(0.05, baseMetrics.conversionRate + (Math.random() - 0.5) * 0.002)),
        lastUpdated: now.toISOString()
    };
    
    // Simulate network delay for a more realistic experience
    setTimeout(() => {
        res.json(metrics);
    }, 300); // 300ms delay
});

app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});

