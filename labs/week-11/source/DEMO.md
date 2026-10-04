```markdown
# หลักฐานการสาธิตระบบและอธิบายซอร์สโค้ด (A4 · CP42)

## 🎥 ลิงก์วิดีโอนำเสนอ
- **URL วิดีโอ:** https://drive.google.com/file/d/1F7_30nwZq36pKoFeiH5X225J9WZ6_DUP/view?usp=drive_link

---

### ช่วง A: สาธิตการทำงานของระบบ (Demonstration)
- [x] รันระบบและเปิดหน้าเว็บครบวงจร (React + Express + SQLite)
- [x] สาธิตการทำงาน CRUD: ดูรายการคำร้อง, เพิ่มคำร้องใหม่, เปลี่ยนสถานะ และลบคำร้อง
- [x] ทดสอบ Endpoint `GET /api/health` แสดงสถานะ `ok` พร้อมข้อมูลฐานข้อมูล
- [x] ทดสอบความคงอยู่ของข้อมูล: ปิดเซิร์ฟเวอร์แล้วเปิดใหม่ ข้อมูลที่เพิ่มยังคงอยู่
- [x] จำลอง Production: รันคำสั่งผ่านพอร์ตเดียว (3001) เปิดได้ทั้งหน้าเว็บและ API

### ช่วง B: อธิบายซอร์สโค้ด (Code Walkthrough)
- [x] **Frontend calling API**: อธิบายการทำงานของ `frontend/src/services/apiClient.js` และ `requestService.js`
- [x] **Request Flow**: อธิบายเส้นทางของข้อมูลเมื่อมีคำขอเข้ามา Route → Controller → Service
- [x] **Database & SQL**: อธิบายคำสั่ง SQL ใน `api/src/services/requestService.js` (การ `JOIN` ตาราง `users` กับ `requests` และการใช้ Parameterized Query)
- [x] **Config Management**: อธิบายการรวมค่าคอนฟิกไว้ที่ `api/src/config.js`
- [x] **Health Check**: อธิบายตรรกะใน `api/src/routes/healthRoutes.js` และการคืน Status 200/503
- [x] **Production Static Serving**: อธิบายการเสิร์ฟ static files และ regex `/^\/(?!api).*/` ใน `api/src/app.js`