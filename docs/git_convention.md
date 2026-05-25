# Git Commit Convention & Workflow (Frontend & Backend)

เอกสารนี้ครอบคลุมมาตรฐานการเขียน Git Commit และแนวทางการทำงานกับ Git (Workflow) ที่บังคับใช้ร่วมกันทั้งในโปรเจกต์ **Frontend** และ **Backend** เพื่อให้ประวัติการแก้ไขโค้ด (Git History) อ่านง่าย มีความเป็นระเบียบ และลดปัญหาการเกิด Merge Conflict

---

## 1. Git Commit Convention (มาตรฐานการเขียน Commit)

เราใช้มาตรฐาน **Conventional Commits** ในการเขียน Commit Message โดยมีรูปแบบโครงสร้างดังนี้:

```git
<type>(<scope>): <subject>

[body - optional]

[footer - optional]
```

### 1.1 ประเภทของ Commit (`<type>`) 🔴 (บังคับ)

| Type           | คำอธิบาย                                                           | ตัวอย่างการใช้งาน                                                 |
| :------------- | :----------------------------------------------------------------- | :---------------------------------------------------------------- |
| **`feat`**     | เพิ่มฟีเจอร์ใหม่ให้กับระบบ                                         | `feat(auth): add login with google`                               |
| **`fix`**      | แก้ไขบั๊ก                                                          | `fix(user): resolve null pointer exception when updating profile` |
| **`docs`**     | แก้ไขหรือเพิ่มเติมเอกสาร (Documentation)                           | `docs: update setup guide in README`                              |
| **`style`**    | ปรับปรุงรูปแบบโค้ดที่ไม่มีผลต่อการทำงาน (Format, Space, Semicolon) | `style: format code with prettier`                                |
| **`refactor`** | ปรับแต่งโครงสร้างโค้ดเดิม (ไม่ได้เพิ่มฟีเจอร์หรือแก้บั๊ก)          | `refactor(api): clean up response formatter`                      |
| **`perf`**     | ปรับปรุงประสิทธิภาพการทำงานของโค้ด (Performance)                   | `perf(image): optimize image compression logic`                   |
| **`test`**     | เพิ่มหรือแก้ไข Test                                                | `test(auth): add unit tests for jwt validation`                   |
| **`chore`**    | งานจิปาถะทั่วไป (อัปเดต dependencies, แก้ไข config)                | `chore: update react version to 18`                               |
| **`ci`**       | การเปลี่ยนแปลงเกี่ยวกับ CI/CD (GitHub Actions, GitLab CI)          | `ci: add test stage to pull request pipeline`                     |

### 1.2 ขอบเขต (`<scope>`) 🟡 (ทางเลือก)

ระบุส่วนของระบบที่มีการเปลี่ยนแปลง เพื่อให้รู้ว่ากระทบส่วนใด เช่น:

- **Common:** `auth`, `api`, `config`, `db`, `core`
- **Frontend:** `ui`, `components`, `store`, `pages`, `router`
- **Backend:** `controller`, `service`, `entity`, `dto`

### 1.3 หัวข้อ (`<subject>`) 🔴 (บังคับ)

- อธิบายสั้น ๆ ว่าทำการแก้ไขอะไร (ไม่เกิน **50 ตัวอักษร**)
- ใช้คำกริยาภาษาอังกฤษขึ้นต้น (เช่น _Add_, _Fix_, _Update_, _Remove_)
- **ไม่ต้อง**ใส่จุดทศนิยม `.` ปิดท้ายประโยค

---

## 2. Git Workflow & Rule of Rebase

เพื่อให้ Git History เป็นเส้นตรง (**Linear History**) อ่านง่าย และไล่ย้อนประวัติได้สะดวก **เราจะใช้ Rebase แทนการ Merge แบบปกติ** (เพื่อหลีกเลี่ยง Merge Commits ที่ไม่จำเป็น)

### 2.1 กฎเหล็กในการทำงานร่วมกัน

1. **ห้ามทำงานบน Branch หลักโดยตรง:** ห้าม commit หรือ push ขึ้น `main` หรือ `master` โดยเด็ดขาด ให้สร้าง Feature Branch เสมอ
2. **อัปเดตโค้ดอย่างสม่ำเสมอ:** ก่อนจะ Push หรือนำโค้ดไปรวม ให้ทำการดึงโค้ดล่าสุดจาก Branch หลักเสมอ
3. **ใช้ Rebase แทน Merge:** เมื่อต้องการอัปเดตโค้ดจาก Branch หลักเข้ามายัง Branch ตัวเอง เพื่อรักษา History ให้เป็นเส้นตรง

### 2.2 ขั้นตอนการอัปเดตโค้ดจาก Branch หลัก (Pull with Rebase)

สมมติว่าคุณกำลังทำงานอยู่บน Branch `feat/add-login` และต้องการดึงโค้ดล่าสุดจาก `main` เพื่ออัปเดตตามให้ทัน

#### 💡 วิธีที่ 1: ดึงและ Rebase ในคำสั่งเดียว (แนะนำ)

```bash
git pull origin main --rebase
```

#### 🛠️ วิธีที่ 2: Fetch และ Rebase แบบแมนนวล

```bash
git fetch origin
git rebase origin/main
```

> [!WARNING]
> **หากเกิด Conflict ระหว่างทำ Rebase:**
>
> 1. ให้เข้าไปแก้ไขไฟล์ที่มีปัญหา (Conflict) ให้เรียบร้อย
> 2. เพิ่มไฟล์ที่แก้ไขเข้า Stage: `git add <file-name>`
> 3. ทำการ Rebase ต่อด้วยคำสั่ง: `git rebase --continue`
>
> 🔴 **ห้ามใช้ `git commit` ระหว่างแก้ Conflict บน Rebase เด็ดขาด**
>
> _หากต้องการยกเลิกการ Rebase ทั้งหมดและกลับไปจุดเริ่มต้น ให้รัน: `git rebase --abort`_

### 2.3 ขั้นตอนการนำโค้ดขึ้น Server (Push)

เมื่อทดสอบการ Rebase บนเครื่องเสร็จเรียบร้อยและผ่านการทดสอบแล้ว ให้ Push เข้าสู่ Branch ของตนเองบน Server:

```bash
git push origin <your-branch-name>
```

> [!IMPORTANT]
> หากก่อนหน้านี้คุณเคย Push ไปที่ Server แล้ว จากนั้นทำการ Rebase บนเครื่องตัวเอง (ทำให้ Git History ฝั่ง Local เปลี่ยนไปไม่ตรงกับ Server)
> คุณอาจจำเป็นต้องใช้คำสั่ง Force Push:
>
> ```bash
> git push origin <your-branch-name> --force-with-lease
> ```
>
> ⚠️ **ย้ำว่าให้ใช้ `--force-with-lease` เสมอ** เนื่องจากมีความปลอดภัยสูงกว่า `--force` ปกติ (จะไม่อัปเดตทับโค้ดใหม่บน Server ที่เรายังไม่ได้ดึงลงมา)

---

## 📌 สรุปข้อปฏิบัติที่สำคัญ (Cheatsheet)

- [ ] อัปเดตโค้ดด้วย `git pull --rebase` เสมอ
- [ ] เขียน Commit Message สื่อความหมายตามมาตรฐาน Conventional Commits
- [ ] **หลีกเลี่ยง**การใช้ Commit Message ที่ไม่มีความหมาย เช่น `update`, `fix bug`, `test`
- [ ] เคลียร์ Conflict ระหว่างการ Rebase ให้เรียบร้อยและรันเทสก่อนทำการ Push
