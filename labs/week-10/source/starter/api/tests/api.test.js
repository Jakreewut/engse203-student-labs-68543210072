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

describe('CP33 · API Integration Tests', () => {

  // 1. GET /api/requests -> 200 และได้ array
  test('1. GET /api/requests -> 200 และได้ array', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body), 'ผลลัพธ์ต้องเป็น array');
  });

  // 2. คืน requesterName ไม่ใช่ requester_id
  test('2. คืน requesterName ไม่ใช่ requester_id', async () => {
    const res = await request(app).get('/api/requests');
    assert.equal(res.status, 200);
    assert.ok(res.body.length > 0, 'ควรมีข้อมูลเริ่มต้นจาก loadSeed()');

    const firstItem = res.body[0];
    assert.ok('requesterName' in firstItem, 'ต้องมี property requesterName');
    assert.equal('requester_id' in firstItem, false, 'ต้องไม่มี property requester_id หลุดออกมา');
  });

  // 3. GET /:id พบ -> 200 • ไม่พบ -> 404
  test('3. GET /api/requests/:id พบ -> 200 และ ไม่พบ -> 404', async () => {
    // 3.1 กรณีพบข้อมูล (ดึง id ที่มีอยู่จริงจากรายการแรก)
    const listRes = await request(app).get('/api/requests');
    const existingId = listRes.body[0]?.id ?? 'REQ-001';

    const resFound = await request(app).get(`/api/requests/${existingId}`);
    assert.equal(resFound.status, 200);
    assert.equal(resFound.body.id, existingId);

    // 3.2 กรณีไม่พบข้อมูล
    const resNotFound = await request(app).get('/api/requests/REQ-999999');
    assert.equal(resNotFound.status, 404);
  });

  // 4. POST ถูกต้อง -> 201
  test('4. POST ข้อมูลถูกต้อง -> 201', async () => {
    const validData = {
      requesterName: 'สมชาย ใจดี',
      requestType: 'แจ้งซ่อม',
      location: 'ห้องปฏิบัติการ 101',
      details: 'เครื่องปรับอากาศไม่ทำงาน',
      priority: 'normal'
    };

    const res = await request(app)
      .post('/api/requests')
      .send(validData);

    assert.equal(res.status, 201);
    assert.ok(res.body.id);
    assert.equal(res.body.requesterName, validData.requesterName);
  });

  // 5. POST ไม่ครบ -> 400
  test('5. POST ข้อมูลไม่ครบ -> 400', async () => {
    const incompleteData = {
      requesterName: 'สมชาย ใจดี'
      // ขาด requestType, location, details
    };

    const res = await request(app)
      .post('/api/requests')
      .send(incompleteData);

    assert.equal(res.status, 400);
  });

  // 6. ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุด
  test('6. ยิง SQL injection ผ่าน ?status= แล้วต้องไม่หลุดข้อมูล', async () => {
    const payload = "' OR '1'='1";
    const res = await request(app)
      .get(`/api/requests?status=${encodeURIComponent(payload)}`);

    // ต้องไม่ล่มเป็น 500
    assert.notEqual(res.status, 500);

    // หากใช้ Prepared Statement ระบบจะมองเป็นค่าสตริงธรรมดาและหาไม่เจอ จึงต้องได้ array ว่าง
    if (res.status === 200) {
      assert.ok(Array.isArray(res.body));
      assert.equal(res.body.length, 0, 'ต้องไม่หลุดข้อมูลทั้งหมดออกมา');
    }
  });

});