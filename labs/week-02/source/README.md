วิชา ENGSE203-Lab2-Modern JavaScript, Modules & Async Data

ชื่อ นาย จักรีวุฒน์ สุขคำเมือง 

รหัสนักศึกษา 68543210072-3 

คำอธิบายโครงงาน การสร้างเว็ปแสดง Learning Dashboard ของวิชา Computer Programming for Software Engineers ด้วยภาษา JavaScript และ vite.config.js แสดงผ่าน gitpub page

วิธีติดตั้งและรัน npm install, npm run dev, npm run check, npm run build  
npm install - npm install  

npm run - npm run dev   

npm check - npm run check  

npm build - npm run build

GitHub Pages URL - https://jakreewut.github.io/engse203-lab02-68543210072-3/
<img width="1900" height="1034" alt="image" src="https://github.com/user-attachments/assets/c0b666e2-edae-4b95-9fbd-9007ea790946" />

<img width="301" height="532" alt="image" src="https://github.com/user-attachments/assets/f24cdeb2-1203-4895-9472-72349d56ef8c" />

ปัญหาที่พบและวิธีแก้
1. ปัญหา: หน้าจอไม่มีสีสันแจ้งเตือนสถานะการโหลดข้อมูล (Loading / Success / Error)
   
   สาเหตุ: ในไฟล์ main.js มีการเรียกใช้ฟังก์ชัน setMessage เพื่อใส่ class เช่น loading, success, error  
          ให้กับกล่องข้อความ แต่ในไฟล์ style.css มีโน้ต /* TODO: เพิ่มรูปแบบ .message.loading, .message.success, .message.error */ ซึ่งยังไม่ได้เขียน CSS รองรับไว้ ทำให้ผู้ใช้งานมองไม่เห็นความต่างของสถานะ
   
   วิธีแก้ไข: เพิ่ม CSS rules ต่อไปนี้ลงในไฟล์ style.css
   
               .message.loading {
                     background-color: #e7eef9;
                     color: #123d78;
                     border-left: 4px solid #1d70b8;
                   }  

               .message.success {
                     background-color: #dfeffd;
                     color: #005a8f;
                     border-left: 4px solid #0070b3;
                   }   
               .message.error {
                     background-color: #fbe6e6;
                     color: #942525;
                     border-left: 4px solid #d43535;
                   }
3. ปัญหา: ลืมเปลี่ยนชื่อ Repository ในคอนฟิกตอน Deploy ลง GitHub Pagesสาเหตุ: ในไฟล์ vite.config.js มีการตั้งค่า repositoryName ไว้เป็นค่าตัวอย่าง "engse203-lab02-68543210072-3" หากนำไปใช้งานโดยไม่เปลี่ยนให้ตรงกับ
          GitHub Repository จริง เวลา build และ deploy ขึ้น GitHub Pages จะทำให้ path ของไฟล์เพี้ยน (Asset 404 Not Found)
   
   วิธีแก้ไข: แก้ไขค่า repositoryName ในไฟล์ vite.config.js ให้เป็นชื่อคลังข้อมูลจริงบน GitHub
   
          // เปลี่ยนให้ตรงชื่อ repository ของตนเองจริงๆ
            const repositoryName = "ชื่อ-repo-จริง";
   
5. ปัญหา: ตัวแปรสเตทในแอปพลิเคชันถูกแก้ไขโดยตรง (State Mutation)สาเหตุ: ในฟังก์ชัน getStats ที่ไฟล์ utils.js มีการใช้ reduce ร่วมกับ Spread Operator พ่นค่าสเตทออกมาในลักษณะคัดลอกพอยท์เตอร์แบบตื้น (...stats) และใน main.js มีการส่ง state.tasks          เข้าไปตรงๆ แม้จะไม่ส่งผลเสียรุนแรงในแล็บนี้แต่เป็นแนวทางการเขียน JavaScript (Anti-pattern) ที่อาจทำให้สเตทภายในเพี้ยนได้หากมีการอัปเดตข้อมูลเพิ่มในอนาคต
   
   วิธีแก้ไข: ปรับฟังก์ชัน getStats ใน utils.js ให้เป็นแบบ Pure และปลอดภัยขึ้น:
   
          export function getStats(tasks) {
            const initStats = { total: 0, todo: 0, doing: 0, done: 0 };
            return tasks.reduce((stats, { status }) => {
              stats.total++;
              if (status in stats) {
                stats[status]++;
              }
              return stats;
            }, initStats);
          }


References & AI Assistance - https://gemini.google.com/app/7e89bc84765ef41f, https://gemini.google.com/app/5c067e37180ee011









   
