const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function testAuth() {
  try {
    console.log('Testing authentication endpoints...\n');

    // Test registration
    console.log('1. Testing user registration...');
    const registerData = {
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123'
    };

    const registerResponse = await axios.post(`${API_BASE_URL}/api/auth/register`, registerData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Registration successful:', registerResponse.data);
    const token = registerResponse.data.token;

    // Test login
    console.log('\n2. Testing user login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Login successful:', loginResponse.data);

    // Test protected route
    console.log('\n3. Testing protected route...');
    const profileResponse = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Profile access successful:', profileResponse.data);

    // Test items API with authentication
    console.log('\n4. Testing items API with authentication...');
    const itemsResponse = await axios.get(`${API_BASE_URL}/api/items`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Items API access successful:', itemsResponse.data);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testAuth(); 