// import request from 'supertest';
// import { app } from '../../server'; // יבוא נכון של app מה-server.ts

// describe('User API', () => {
//   it('should reject register with missing fields', async () => {
//     const res = await request(app)
//       .post('/api/user/auth/register')
//       .send({ email: 'test@example.com' });
//     expect(res.status).toBe(400);
//     expect(res.body).toHaveProperty('error');
//   });

//   it('should reject login with wrong password', async () => {
//     const res = await request(app)
//       .post('/api/user/auth/login')
//       .send({ email: 'notfound@example.com', password: 'wrongpass' });
//     expect([401, 404]).toContain(res.status);
//     expect(res.body).toHaveProperty('error');
//   });
// });
