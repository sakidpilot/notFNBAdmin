import request from 'supertest';
import app from '../backend/server.js'; 

export const testAPI = async () => {
describe('Auth API', () => {
  // Test the login endpoint
  let token; let role;
  test('should log in and return a token', async () => {
    const response = await request(app)
      .post('https://localhost/api/auth/login')
      .send({ username: 'Rajesh', accountNum: "111065", password: 'Raj@1234' });
      token = response.body.token; role = response.body.user.role
      
    expect(response.statusCode).toBe(200); // Check status
    expect(response.body).toHaveProperty('token'); // Check if token is present
    expect(response.body).toHaveProperty('user.role'); // Check if role is present
  });

  /* Test the registration endpoint
  test('should register a new user', async () => {
    const response = await request(app)
    .post('https://localhost/api/admin/signup')
    .set('Authorization', `Bearer ${token}`, role) // Pass token in the header
    .send({ username: 'Spongebob', password: 'Test@1234', email: 'spongebob@gmail.com' });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('message', 'User registered successfully');
  });*/

  describe('Payments API', () => {
    let token;
  
    // Login and get token before running tests
    beforeAll(async () => {
      const response = await request(app)
        .post('https://localhost/api/auth/login')
        .send({ username: 'Mishka', accountNum: "15951", password: 'Test@123' });
      token = response.body.token;
    });
  
    test('should get all payment entries', async () => {
      const response = await request(app)
        .get('https://localhost/api/payment/read/:details')
        .set('Authorization', `Bearer ${token}`); // Pass token in the header
  
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  
    test('should create a new payment entry', async () => {
      const newPayment = {
        userAcc: '15951',
        amount: 100,
        currency: 'ZAR',
        provider: 'SWIFT',
        accountInfo: '987654321',
        swiftCode: '12345',
        transactionStatus: 'Pending'
      };
      
      const response = await request(app)
        .post('https://localhost/api/payment/add')
        .set('Authorization', `Bearer ${token}`)
        .send(newPayment);
  
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('message', 'Payment created successfully');
    });
  });
});}