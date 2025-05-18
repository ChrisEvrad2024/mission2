import request from 'supertest';
import app from '../index';
import { User } from '../models/User';
import { Role } from '../models/Role';
import { initializeDatabase } from '../config/database';
import { seedDefaultRoles } from '../seeders/defaultRoles';

beforeAll(async () => {
  await initializeDatabase();
  await seedDefaultRoles();
});

describe('Authentication API', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'SecurePassword123!',
    role: 'etudiant'
  };

  beforeAll(async () => {
    // Clean up before tests
    await User.destroy({ where: {} });
  });

  test('POST /register - should register a new user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('userId');
  });

  test('POST /login - should authenticate user', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });

  test('GET /me - should return current user', async () => {
    // First login to get token
    const loginResponse = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    const token = loginResponse.body.accessToken;

    const response = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.email).toBe(testUser.email);
  });
});
