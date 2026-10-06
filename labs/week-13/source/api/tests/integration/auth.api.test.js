import { describe, test, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';
import { loadSeed } from '../../src/services/requestService.js';
import { STAFF, loginAsStaff, tokenFor } from '../helpers/auth.js';
import { resetLoginLimiter } from '../../src/routes/authRoutes.js';

const app = createApp();

beforeEach(async () => {
  resetLoginLimiter(); // ⭐ ล้างประวัติ 429 ทุกครั้งก่อนเริ่มแต่ละข้อ
  await loadSeed();
});

describe('POST /api/auth/login', () => {
  test('อีเมลและรหัสผ่านถูก → 200 พร้อม token', async () => {
    const r = await request(app).post('/api/auth/login').send(STAFF);
    expect(r.status).toBe(200);
    expect(r.body.token.split('.')).toHaveLength(3);
  });

  test('รหัสผ่านผิด → 401', async () => {
    const r = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'nope1234' });
    expect(r.status).toBe(401);
  });

  test('รหัสผ่านผิด กับ อีเมลที่ไม่มี → 401 ข้อความเดียวกัน', async () => {
    const wrong = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'nope1234' });
    const unknown = await request(app).post('/api/auth/login').send({ email: 'ghost@rmutl.ac.th', password: 'nope1234' });
    expect(wrong.status).toBe(401);
    expect(unknown.status).toBe(401);
    expect(wrong.body.error).toBe(unknown.body.error);
  });

  // ⭐ Challenge Test: ผิด 5 ครั้งติดต่อกัน ครั้งถัดไปได้ 429
  test('login ผิด 5 ครั้งใน 15 นาที → 429', async () => {
    for (let i = 0; i < 5; i++) {
      const r = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'wrong' });
      expect(r.status).toBe(401);
    }
    const blocked = await request(app).post('/api/auth/login').send({ ...STAFF, password: 'wrong' });
    expect(blocked.status).toBe(429);
  });
});

describe('สิทธิ์ของ PUT / DELETE', () => {
  const put = () => request(app).put('/api/requests/REQ-001').send({ status: 'completed' });

  test('token ที่เซ็นด้วย secret อื่น (ปลอม) → 401', async () => {
    const r = await put().set('Authorization', `Bearer ${tokenFor('staff', 'not-the-real-secret')}`);
    expect(r.status).toBe(401);
  });

  test('token ถูกต้องแต่ไม่ใช่เจ้าหน้าที่ → 403', async () => {
    const r = await put().set('Authorization', `Bearer ${tokenFor('requester')}`);
    expect(r.status).toBe(403);
  });

  test('เจ้าหน้าที่ → PUT 200 และ DELETE 204', async () => {
    const auth = `Bearer ${await loginAsStaff(app)}`;
    await put().set('Authorization', auth).expect(200);
    await request(app).delete('/api/requests/REQ-002').set('Authorization', auth).expect(204);
  });

  test('ส่งคำร้อง (POST) และดูรายการ (GET) ยังไม่ต้องเข้าสู่ระบบ', async () => {
    await request(app).get('/api/requests').expect(200);
    await request(app).post('/api/requests').send({
      requesterName: 'นักศึกษา ทั่วไป', requestType: 'แจ้งซ่อม', location: 'ห้อง 205',
      details: 'ไฟห้องเรียนดับสองดวง', priority: 'normal',
    }).expect(201);
  });
});