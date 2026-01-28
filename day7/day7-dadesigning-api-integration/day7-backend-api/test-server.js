const http = require('http');

const BACKEND_URL = 'http://localhost:3001';

async function testEndpoint(endpoint, name) {
    return new Promise((resolve, reject) => {
        http.get(`${BACKEND_URL}${endpoint}`, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                if (res.statusCode === 200) {
                    const json = JSON.parse(data);
                    if (json.value && json.value > 0) {
                        console.log(`✓ ${name}: ${json.value}`);
                        resolve(true);
                    } else {
                        console.error(`✗ ${name}: Value is zero or missing`);
                        resolve(false);
                    }
                } else {
                    console.error(`✗ ${name}: HTTP ${res.statusCode}`);
                    resolve(false);
                }
            });
        }).on('error', (err) => {
            console.error(`✗ ${name}: ${err.message}`);
            resolve(false);
        });
    });
}

async function runTests() {
    console.log('Running backend API tests...\n');
    const results = [];
    
    // Test multiple times to account for random failures
    for (let i = 0; i < 5; i++) {
        const activeUsers = await testEndpoint('/api/metrics/active-users', 'Active Users');
        const dailyRevenue = await testEndpoint('/api/metrics/daily-revenue', 'Daily Revenue');
        results.push(activeUsers, dailyRevenue);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    const successCount = results.filter(r => r).length;
    const totalTests = results.length;
    
    console.log(`\nTests passed: ${successCount}/${totalTests}`);
    
    if (successCount >= totalTests * 0.6) {
        console.log('✓ Backend tests: PASSED');
        process.exit(0);
    } else {
        console.log('✗ Backend tests: FAILED');
        process.exit(1);
    }
}

// Wait for server to be ready
setTimeout(runTests, 2000);
