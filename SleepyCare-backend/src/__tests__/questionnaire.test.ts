// import { app } from '../../server';
// import request from 'supertest';

// describe('Questionnaire API', () => {
//   let token = '';
//   // כאן תוכל להוסיף יצירת משתמש וכניסה לקבלת טוקן

//   it('should reject creating questionnaire without token', async () => {
//     const res = await request(app)
//       .post('/api/questionnaire/create')
//       .send({ title: 'שאלון בדיקה', questions: [] });
//     expect(res.status).toBe(401);
//     expect(res.body).toHaveProperty('error');
//   });

//   // בדיקות נוספות: יצירה, עדכון, שליפה, שליחת תשובות
// });
