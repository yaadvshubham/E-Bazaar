const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) },
    };
    const req = http.request(options, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(raw) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  try {
    // Test register
    const r1 = await post('/api/auth/register', { name: 'Test User', email: 'test@ebazaar.com', password: 'test123' });
    console.log('REGISTER:', r1.status, JSON.stringify(r1.body));

    // Test login
    const r2 = await post('/api/auth/login', { email: 'test@ebazaar.com', password: 'test123' });
    console.log('LOGIN:   ', r2.status, JSON.stringify(r2.body));

    // Test duplicate register
    const r3 = await post('/api/auth/register', { name: 'Test User', email: 'test@ebazaar.com', password: 'test123' });
    console.log('DUPLICATE:', r3.status, JSON.stringify(r3.body));

    // Test wrong password
    const r4 = await post('/api/auth/login', { email: 'test@ebazaar.com', password: 'wrongpass' });
    console.log('WRONG PWD:', r4.status, JSON.stringify(r4.body));

  } catch (err) {
    console.error('Test failed:', err.message);
  }
}
run();
