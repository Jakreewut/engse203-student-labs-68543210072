import { Router } from 'express';
import * as controller from '../controllers/requestController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { authenticate, requireRole } from '../middleware/auth.js';
import { loadSeed } from '../services/requestService.js';

const router = Router();

router.post('/reset', (req, res) => {
  try {
    execSync('npm run db:reset --prefix api');
    res.status(200).json({ message: 'reset สำเร็จ' });
  } catch (err) {
    res.status(500).json({ error: 'ไม่สามารถรีเซ็ตฐานข้อมูลได้' });
  }
});

// route เจาะจงต้องมาก่อน route ที่มี :id เสมอ
router.get('/', controller.listRequests);
router.post('/', validateRequest, controller.createRequest);
router.get('/:id', controller.getRequest);
// 🏫 TODO W13-AUTH (CP51): เปลี่ยนสถานะและลบ ได้เฉพาะเจ้าหน้าที่
//   router.put('/:id', authenticate, requireRole('staff'), controller.updateRequestStatus);
router.put('/:id', authenticate, requireRole('staff'), controller.updateRequestStatus);
router.delete('/:id', authenticate, requireRole('staff'), controller.deleteRequest);

export default router;
