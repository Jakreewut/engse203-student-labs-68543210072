import { test, before, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { loadSeed } from '../src/services/requestService.js';

let app;
before(async () => {
  await loadSeed();
  app = createApp();
});

const validRequest = {
  requesterName: 'ทดสอบ ระบบ',
  requestType: 'แจ้งซ่อม',
  location: 'C3-401',
  details: 'รายละเอียดยาวพอสมควรจริง',
  priority: 'normal',
};

/**
 * TODO W07-TEST (🏠 CP16) · เขียน test อย่างน้อย 6 เคส
 *
 * ที่ต้องมี
 *   1. GET /api/requests            → 200 และได้ array
 *   2. GET /api/requests/:id พบ      → 200
 *   3. GET /api/requests/:id ไม่พบ   → 404
 *   4. POST ข้อมูลถูกต้อง            → 201 และ status เป็น pending
 *   5. POST ข้อมูลไม่ครบ             → 400
 *   6. CORS header ตอบ origin ที่อนุญาต
 *
 * รันด้วย: npm test
 * ตัวอย่างโครง (ลบคอมเมนต์นี้แล้วเขียนจริง)
 */
// 1. GET /api/requests → 200 และได้ array
describe('GET /api/requests', () => {
  test('คืนรายการทั้งหมด พร้อม status 200 และได้ array', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
  });
});

// 2. GET /api/requests/:id พบ → 200
describe('GET /api/requests/:id (พบคำร้อง)', () => {
  test('ดึงข้อมูลคำร้องที่มีอยู่ในระบบ คืน status 200', async () => {
    const res = await request(app).get('/api/requests/REQ-001');
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 'REQ-001');
  });
});

// 3. GET /api/requests/:id ไม่พบ → 404
describe('GET /api/requests/:id (ไม่พบคำร้อง)', () => {
  test('ค้นหาคำร้องที่ไม่เคยมีอยู่ คืน status 404', async () => {
    const res = await request(app).get('/api/requests/REQ-999');
    assert.equal(res.status, 404);
    assert.ok(res.body.error);
  });
});

// 4. POST ข้อมูลถูกต้อง → 201 และ status เป็น pending
describe('POST /api/requests (ข้อมูลถูกต้อง)', () => {
  test('สร้างคำร้องใหม่สำเร็จ คืน status 201 และ status เริ่มต้นเป็น pending', async () => {
    const payload = {
      requesterName: 'ทดสอบ ระบบ',
      requestType: 'แจ้งซ่อม',
      location: 'ห้องปฏิบัติการ 301',
      details: 'เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า',
      priority: 'normal',
    };
    const res = await request(app).post('/api/requests').send(payload);

    assert.equal(res.status, 201);
    assert.equal(res.body.status, 'pending');
    assert.ok(res.body.id);
  });
});

// 5. POST ข้อมูลไม่ครบ → 400
describe('POST /api/requests (ข้อมูลไม่ครบ)', () => {
  test('ส่งข้อมูลไม่ครบถ้วนตาม validation คืน status 400', async () => {
    const invalidPayload = {
      requesterName: 'ก', // สั้นเกินไป และไม่มีฟิลด์จำเป็นอื่น
    };
    const res = await request(app).post('/api/requests').send(invalidPayload);

    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });
});

// 6. CORS header ตอบ origin ที่อนุญาต
describe('CORS Header', () => {
  test('ตอบกลับ header Access-Control-Allow-Origin ตรงกับ origin ที่อนุญาต', async () => {
    const res = await request(app)
      .get('/api/requests')
      .set('Origin', 'http://localhost:5173');

    assert.equal(
      res.headers['access-control-allow-origin'],
      'http://localhost:5173'
    );
  });
});

