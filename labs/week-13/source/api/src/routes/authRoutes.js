import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

const router = Router();

// ⭐ Challenge: เก็บประวัติการล็อกอินผิด (IP -> [timestamp, ...])
const failedAttempts = new Map();
const WINDOW_MS = 15 * 60 * 1000; // 15 นาที
const MAX_ATTEMPTS = 5;

export function resetLoginLimiter() {
  failedAttempts.clear();
}

router.post('/login', (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || 'client';
  const now = Date.now();
  const attempts = (failedAttempts.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  failedAttempts.set(ip, attempts);

  // ถ้าผิดครบ 5 ครั้งแล้ว ให้ตอบกลับ 429 ทันที
  if (attempts.length >= MAX_ATTEMPTS) {
    return res.status(429).json({ error: 'ลองเข้าสู่ระบบผิดพลาดบ่อยเกินไป กรุณารอ 15 นาที' });
  }

  const errors = validateLoginInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง', details: errors });
  }

  const result = authService.login(req.body.email, req.body.password);
  if (!result) {
    attempts.push(Date.now());
    failedAttempts.set(ip, attempts);
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  }

  // เมื่อล็อกอินสำเร็จ ล้างประวัติที่เคยผิดของ IP นี้
  failedAttempts.delete(ip);
  res.status(200).json(result);
});

export default router;