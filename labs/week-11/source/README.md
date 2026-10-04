# Campus Service — Full-Stack (Week 11 · starter)

> 🏠 TODO W11-README (CP40) — เขียน README นี้ใหม่ให้ครบ:
# Campus Service Request — Full-Stack Application

ระบบแจ้งซ่อมและบริการอุปกรณ์ภายในวิทยาเขต พัฒนาด้วยสถาปัตยกรรม Full-Stack 3 ชั้น เชื่อมต่อการทำงานครบวงจรตั้งแต่ Frontend, Backend API ไปจนถึงระบบจัดการฐานข้อมูล พร้อมสำหรับการ Deploy สู่ Production

---

## 🏗️ สถาปัตยกรรม 3 ชั้น (3-Tier Architecture)

ระบบแยกความรับผิดชอบอย่างชัดเจนตามแนวคิด Layered Architecture:

```text
┌───────────────────────┐              HTTP / JSON              ┌──────────────────────────┐              SQL / Rows              ┌────────────────────────┐
│       Frontend        │ <───────────────────────────────────> │       Express API        │ <──────────────────────────────────> │        Database        │
│  (React + Vite + UI)  │                                       │  (Route/Controller/Svc)  │                                       │   (SQLite / Turso)     │
└───────────────────────┘                                       └──────────────────────────┘                                       └────────────────────────┘
```


| ชั้น | หน้าที่ความรับผิดชอบ | เทคโนโลยีที่ใช้ | ตำแหน่งโฟลเดอร์ |
|---|---|---|---|
| **Frontend** | รับข้อมูลจากผู้ใช้ แสดงผล Dashboard และจัดการ Client State | React, Vite | `frontend/` |
| **API** | ประมวลผลคำขอ, ตรวจสอบข้อมูล (Validation), Logging, Error Handling | Node.js, Express | `api/src/` |
| **Database** | จัดเก็บข้อมูลถาวรอย่างปลอดภัย ควบคุมโครงสร้างด้วย Constraints | SQLite (`node:sqlite`) | `api/data/` |

---

## 🚀 วิธีการรันระบบ

### 1. โหมดพัฒนา (Development)
รันแยก 2 Process ผ่าน 2 หน้าต่าง Terminal เพื่อให้ Frontend มี Hot Reload:

```bash
# เตรียมฐานข้อมูลและ Dependencies
cd api
npm install
npm run db:setup
cd ../frontend && npm install
cd ..

# Terminal 1: เปิด Express API (พอร์ต 3001)
cd api && npm run dev

# Terminal 2: เปิด React Frontend (พอร์ต 5173)
cd frontend && npm run dev

# ขั้นที่ 1: Build Frontend ให้เป็น Static Assets (dist/)
cd frontend
npm run build
cd ..

# ขั้นที่ 2: รัน Express API ในโหมด Production
cd api
NODE_ENV=production npm start

```

## 🚀 วิธีการรันระบบ

| ตัวแปร | โหมด Dev (Default) | โหมด Production | คำอธิบาย |
|---|---|---|---|
| NODE_ENV	| development	| production	| กำหนดสภาพแวดล้อม (ส่งผลต่อการเสิร์ฟ static และ morgan format) |
| PORT	| 3001	| กำหนดตาม Cloud/Host	| พอร์ตที่ API เปิดรับคำขอ |
| CORS_ORIGIN	| http://localhost:5173	| โดเมนของ Production	| กำหนด Allowed Origin สำหรับ CORS |
| DB_FILE	| api/data/campus.db	| api/data/campus.db	| ตำแหน่งของไฟล์ฐานข้อมูล SQLite |
| STATIC_DIR	| frontend/dist	| frontend/dist	| โฟลเดอร์ที่เก็บไฟล์ Build ของ Frontend |

---

## การตัดสินใจในการออกแบบ (Design Decisions)
การแยกชั้นอย่างเคร่งครัด (Separation of Concerns):

Frontend ไม่จำเป็นต้องรับรู้โครงสร้างฐานข้อมูล รับ-ส่งข้อมูลผ่าน JSON ตาม API Contract

Controller รับผิดชอบเรื่อง HTTP Request/Response และ Status Code โดยไม่แตะต้อง SQL

Service รับผิดชอบตรรกะข้อมูลและการทำ SQL Query โดยไม่ยึดติดกับ Express req/res

การรวมพอร์ตเดียวใน Production:

ใน Production หลีกเลี่ยงการเปิดหลาย Server เพื่อประหยัดทรัพยากร ลดความซับซ้อนของ CORS และลดค่าใช้จ่ายบน Cloud

Express ทำหน้าที่เสิร์ฟ Static Files จาก dist/ และจัดการ Fallback Routing (/^\/(?!api).*/) ส่งกลับ index.html เพื่อให้ Client-side Routing ของ React ทำงานได้ถูกต้อง

Health Check Endpoint (/api/health):

มีการตรวจสอบการเชื่อมต่อไปจนถึงระดับฐานข้อมูล (getDbStatus()) และตอบรหัส 503 หากฐานข้อมูลมีปัญหา เพื่อให้ Load Balancer หรือ Cloud Platform ทราบสถานะจริงก่อนส่ง Traffic เข้ามา

## 🌐 Live Demo
🔗 https://engse203-student-labs-68543210072.onrender.com
