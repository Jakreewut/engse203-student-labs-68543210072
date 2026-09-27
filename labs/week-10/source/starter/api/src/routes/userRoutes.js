import { Router } from 'express';
import { getAllUsers, getUserById, getRequestsByUserId } from '../services/requestService.js';

const router = Router();

// GET /api/users -> รายชื่อผู้ใช้ทั้งหมด
router.get('/', (req, res) => {
  const users = getAllUsers();
  res.json(users);
});

// GET /api/users/:id/requests -> คำร้องของคนนั้น
router.get('/:id/requests', (req, res) => {
  const { id } = req.params;
  const user = getUserById(id);
  if (!user) {
    return res.status(404).json({ error: 'ไม่พบผู้ใช้' });
  }
  const requests = getRequestsByUserId(id);
  res.json(requests);
});

export default router;