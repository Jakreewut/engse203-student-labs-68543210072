const REQUEST_TYPES = ['แจ้งซ่อม', 'บริการบัญชีผู้ใช้', 'ขอใช้อุปกรณ์', 'อื่น ๆ'];
const PRIORITIES = ['normal', 'urgent'];
const STATUSES = ['pending', 'in-progress', 'completed'];

/** ตัวช่วยอ่านข้อความอย่างปลอดภัย */
function readText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// 1. กฎการตรวจสอบแยกรายฟิลด์
const fieldValidators = {
  requesterName: (val) =>
    readText(val).length < 2 ? 'ชื่อผู้แจ้งต้องมีอย่างน้อย 2 ตัวอักษร' : null,

  requestType: (val) =>
    !REQUEST_TYPES.includes(val) ? 'ประเภทคำร้องไม่ถูกต้อง' : null,

  location: (val) =>
    !readText(val) ? 'กรุณาระบุสถานที่' : null,

  details: (val) =>
    readText(val).length < 10 ? 'รายละเอียดต้องมีอย่างน้อย 10 ตัวอักษร' : null,

  priority: (val) =>
    !PRIORITIES.includes(val) ? 'ความเร่งด่วนต้องเป็น normal หรือ urgent' : null,

  status: (val) =>
    !STATUSES.includes(val) ? 'status ต้องเป็น pending, in-progress หรือ completed เท่านั้น' : null
};

// 2. Middleware Factory (Challenge 3)
export function createValidator(fields = []) {
  return (req, res, next) => {
    const input = req.body;
    if (!input || typeof input !== 'object') {
      return res.status(400).json({ error: 'ต้องส่งข้อมูลคำร้องมาด้วย' });
    }

    const errors = [];
    for (const field of fields) {
      if (fieldValidators[field]) {
        const err = fieldValidators[field](input[field]);
        if (err) errors.push(err);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: 'ข้อมูลคำร้องไม่ถูกต้อง',
        details: errors
      });
    }

    next();
  };
}

// 3. Export เป็น Middleware พร้อมใช้งาน (ประกาศเพียงรอบเดียว)
export const validateRequest = createValidator([
  'requesterName',
  'requestType',
  'location',
  'details',
  'priority'
]);

export const validateUpdateStatus = createValidator(['status']);