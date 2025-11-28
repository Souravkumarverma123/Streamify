#!/usr/bin/env node

const axios = require('axios');

async function testConnection() {
    console.log('🧪 Testing Chai Video Connection...\n');
    
    const backendUrl = 'http://localhost:8000';
    const frontendUrl = 'http://localhost:3000';
    
    try {
        // Test backend health
        console.log('1. Testing Backend...');
        const backendResponse = await axios.get(`${backendUrl}/api/v1/users/current-user`, {
            timeout: 5000,
            validateStatus: () => true // Accept any status code
        });
        
        if (backendResponse.status === 401) {
            console.log('✅ Backend is running (401 expected for unauthenticated request)');
        } else {
            console.log(`✅ Backend is running (Status: ${backendResponse.status})`);
        }
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Backend is not running. Start it with: cd chai-backend && npm run dev');
        } else {
            console.log(`❌ Backend error: ${error.message}`);
        }
    }
    
    try {
        // Test frontend
        console.log('\n2. Testing Frontend...');
        const frontendResponse = await axios.get(frontendUrl, {
            timeout: 5000,
            validateStatus: () => true
        });
        
        if (frontendResponse.status === 200) {
            console.log('✅ Frontend is running');
        } else {
            console.log(`⚠️  Frontend responded with status: ${frontendResponse.status}`);
        }
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            console.log('❌ Frontend is not running. Start it with: cd chai-frontend && npm run dev');
        } else {
            console.log(`❌ Frontend error: ${error.message}`);
        }
    }
    
    console.log('\n📋 Connection Test Summary:');
    console.log('==========================');
    console.log('Backend:  http://localhost:8000');
    console.log('Frontend: http://localhost:3000');
    console.log('\n💡 If both are running, you can:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Register a new account');
    console.log('3. Test the authentication flow');
    console.log('\n✨ Happy coding!');
}

// Run the test
testConnection().catch(console.error);
