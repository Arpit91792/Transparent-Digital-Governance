// Script to delete all accounts and their details
// Run with: node delete-all-accounts.js

import http from 'http';
import https from 'https';
import { URL } from 'url';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';

async function makeRequest(urlString, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const client = url.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    
    req.end();
  });
}

async function deleteAllAccounts() {
  try {
    console.log('🔐 Logging in as admin...');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    
    // Step 1: Login as admin
    const loginResponse = await makeRequest(
      `${SERVER_URL}/api/auth/login`,
      'POST',
      {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      }
    );

    if (loginResponse.statusCode !== 200 || !loginResponse.data.token) {
      console.error('❌ Login failed:', loginResponse.data);
      console.error('\nPlease make sure:');
      console.error('1. The server is running (npm run dev)');
      console.error('2. Admin credentials are correct (admin@example.com / password123)');
      console.error('3. Or set ADMIN_EMAIL and ADMIN_PASSWORD environment variables');
      process.exit(1);
    }

    const token = loginResponse.data.token;
    console.log('✅ Login successful!');
    console.log('');

    // Step 2: Delete all accounts and details
    console.log('⚠️  Deleting all accounts and all associated details...');
    console.log('   This action cannot be undone!');
    console.log('');

    const deleteResponse = await makeRequest(
      `${SERVER_URL}/api/admin/delete-all-accounts-and-details`,
      'POST',
      null,
      {
        'Authorization': `Bearer ${token}`
      }
    );

    if (deleteResponse.statusCode === 200) {
      console.log('✅ Successfully deleted all accounts and details!');
      console.log('');
      console.log('📊 Deletion Summary:');
      console.log(`   - ${deleteResponse.data.usersDeleted || 0} user account(s)`);
      console.log(`   - ${deleteResponse.data.applicationsDeleted || 0} application(s)`);
      console.log(`   - ${deleteResponse.data.feedbackDeleted || 0} feedback/rating(s)`);
      console.log(`   - ${deleteResponse.data.notificationsDeleted || 0} notification(s)`);
      console.log(`   - ${deleteResponse.data.warningsDeleted || 0} warning(s)`);
      console.log(`   - ${deleteResponse.data.otpRecordsDeleted || 0} OTP record(s)`);
      console.log(`   - ${deleteResponse.data.blockchainHashesDeleted || 0} blockchain hash(es)`);
      console.log(`   - ${deleteResponse.data.applicationHistoryDeleted || 0} application history record(s)`);
      console.log(`   - ${deleteResponse.data.applicationLocationHistoryDeleted || 0} location history record(s)`);
      console.log('');
      console.log('ℹ️  Note: Restart your server to recreate the default admin account.');
    } else if (deleteResponse.statusCode === 401 || deleteResponse.statusCode === 403) {
      console.error('❌ Authentication failed. You need to be logged in as admin.');
      console.error('Response:', deleteResponse.data);
      process.exit(1);
    } else {
      console.error('❌ Error deleting accounts:', deleteResponse.data);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Make sure:');
    console.error('1. The server is running: npm run dev');
    console.error('2. The server URL is correct (default: http://localhost:5000)');
    console.error('3. You can set SERVER_URL environment variable if different');
    process.exit(1);
  }
}

// Run the script
deleteAllAccounts();

