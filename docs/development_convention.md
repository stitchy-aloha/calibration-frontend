# Development Conventions & Standards Index

สารบัญรวมข้อตกลงและมาตรฐานการพัฒนา (Coding Standards & Conventions) สำหรับส่วนการทำงานหลักต่าง ๆ ของโปรเจกต์ (ทั้ง Frontend และ Backend) เพื่อให้โค้ดเป็นระเบียบ เรียบร้อย และบำรุงรักษาง่าย

คลิกเพื่ออ่านรายละเอียดการตั้งค่าและแนวปฏิบัติในแต่ละหัวข้อ:

## 📂 รายการข้อกำหนดการเขียนโค้ด (Coding Conventions)

1. **[Git Commit & Workflow](file:///Users/stitchy/Desktop/Finish%20Line/cal_frontend/docs/git_convention.md)**
   - มาตรฐานการเขียน Git Commit Message (Conventional Commits)
   - กฎเหล็กของการใช้ Git Pull Rebase
   
2. **[การแบ่งหน้าข้อมูล (Pagination)](file:///Users/stitchy/Desktop/Finish%20Line/cal_frontend/docs/pagination.md)**
   - DTO & API Request/Response มาตรฐานสำหรับการดึงข้อมูลฝั่ง Backend (NestJS)
   - การเชื่อมต่อข้อมูลร่วมกับ Quasar `q-table` (Server-side Pagination)

3. **[ระบบเส้นทางและการนำทาง (Routing & Navigation)](file:///Users/stitchy/Desktop/Finish%20Line/cal_frontend/docs/routing.md)**
   - โครงสร้างและแนวทางการระบุเส้นทาง URL (Vue Router 4)
   - กฎเหล็ก Lazy Loading เพื่อประสิทธิภาพความเร็ว
   - การเขียนระบบตรวจสอบสิทธิ์ก่อนการเข้าหน้าเว็บ (Navigation Guards)

4. **[การจัดการสถานะร่วม (State Management - Pinia)](file:///Users/stitchy/Desktop/Finish%20Line/cal_frontend/docs/state_management.md)**
   - รูปแบบการประกาศ Store แบบ Composition (Setup Syntax)
   - กฎเหล็กการทำ `reset()` ล้างค่าข้อมูลเก่าค้างแสดงบนหน้ารายละเอียดใหม่ (Stale Cache Prevention)

5. **[ความปลอดภัยและสิทธิ์การใช้งาน (RBAC)](file:///Users/stitchy/Desktop/Finish%20Line/cal_frontend/docs/rbac.md)**
   - สิทธิ์และบทบาทหน้าที่ของตัวละครในระบบ (Admin, Technician, Approver)
   - การซ่อน/แสดงและควบคุมการเปิด-ปิดองค์ประกอบในหน้ารายการด้วย Composable `useRoleAccess()`

6. **[การตรวจสอบความถูกต้องของฟอร์ม (Form Validation)](file:///Users/stitchy/Desktop/Finish%20Line/cal_frontend/docs/form_validation.md)**
   - การกำหนดฟังก์ชันและตรวจสอบฟิลด์อินพุตในระดับหน้าจอของผู้ใช้ (Quasar Input Rules)
   - การเขียน Schema validation ครอบคลุมฝั่ง API ด้วย DTO (`class-validator` ใน NestJS)

7. **[การทับศัพท์และโครงสร้างภาษา (Localization - i18n)](file:///Users/stitchy/Desktop/Finish%20Line/cal_frontend/docs/i18n.md)**
   - กฎเหล็กห้ามระบุข้อความแบบ Hardcoded ลงในเพจโดยตรง
   - ตัวอย่างการเขียนไฟล์ JSON แปลภาษา และการนำไปใช้อ้างอิงทั้งบน Vue Template และ Script setup
