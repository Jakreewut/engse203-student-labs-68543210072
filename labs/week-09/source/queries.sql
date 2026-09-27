-- ① คำร้องทั้งหมด เรียงตามรหัส
SELECT * 
FROM requests 
ORDER BY id ASC;

-- ② คำร้องที่ยังไม่ได้ดำเนินการ
SELECT * 
FROM requests 
WHERE status = 'pending' 
ORDER BY id ASC;

-- ③ คำร้องเร่งด่วนที่ยังไม่เสร็จ (เงื่อนไข 2 ข้อพร้อมกัน)
SELECT * 
FROM requests 
WHERE priority = 'urgent' 
  AND status != 'completed';

-- ④ ค้นคำร้องจากคำบางส่วนในรายละเอียด (มีคำว่า ห้องปฏิบัติการ)
SELECT * 
FROM requests 
WHERE details LIKE '%ห้องปฏิบัติการ%';

-- ⑤ คำร้องพร้อมชื่อผู้แจ้ง (JOIN ระหว่าง requests กับ users)
SELECT 
  r.id,
  r.request_type,
  r.location,
  r.details,
  r.priority,
  r.status,
  u.name AS requester_name,
  u.department
FROM requests r
JOIN users u ON r.requester_id = u.id;

-- ⑥ คำร้องเฉพาะของภาควิชาหนึ่ง (JOIN + WHERE)
SELECT 
  r.id,
  r.request_type,
  r.details,
  u.name AS requester_name,
  u.department
FROM requests r
JOIN users u ON r.requester_id = u.id
WHERE u.department = 'วิศวกรรมซอฟต์แวร์';

-- ⑦ รายชื่อผู้แจ้งที่ไม่ซ้ำกัน (DISTINCT)
SELECT DISTINCT 
  u.name, 
  u.department
FROM requests r
JOIN users u ON r.requester_id = u.id;

-- ⑧ คำร้อง 3 รายการล่าสุด
SELECT * 
FROM requests 
ORDER BY created_at DESC, id DESC 
LIMIT 3;

-- ⭐ Challenge ─────────────────────────────────────────────
-- ⑨ นับจำนวนคำร้องแยกตามสถานะ
SELECT status, COUNT(*) AS total_requests
FROM requests
GROUP BY status;

-- ⑩ ใครแจ้งคำร้องมากที่สุด
SELECT u.name, u.department, COUNT(r.id) AS total_requests
FROM users u
LEFT JOIN requests r ON u.id = r.requester_id
GROUP BY u.id, u.name
ORDER BY total_requests DESC
LIMIT 1;

-- ⑪ สร้าง INDEX ให้การค้นด้วย status เร็วขึ้น
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);