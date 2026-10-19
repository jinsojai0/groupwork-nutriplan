# GroupWork_NutriPlan

โครงงาน **NutriPlan** ระบบให้ความรู้ด้านโภชนาการและวางแผนมื้ออาหารสำหรับอาหารจานเดียวและอาหารตามสั่งของไทย
(Nutrition Literacy and Meal Planning System for Thai Single-dish and Made-to-order Meals)

| | |
|---|---|
| รายวิชา | CSD3202 การพัฒนาเว็บแอปพลิเคชัน ภาคเรียนที่ 1/2569 |
| ผู้จัดทำ | นาย กิตติภัฎ ท่าห้อง (66122250094) |
| อาจารย์ผู้สอน | ผศ. เสถียร จันทร์ปลา |
| เทคโนโลยี | React + React Router + Vite, Firebase Realtime Database, Firebase Authentication |

โฟลเดอร์นี้รวมผลงานงานที่ 2 (ข้อเสนอโครงงาน) งานที่ 4 (Data and Digital Asset Design) และงานที่ 5 (System Design and Prototype) ทุกงานใช้รหัสข้อมูลชุดเดียวกัน

## 1. โครงสร้าง Folder

```
GroupWork_NutriPlan/
├── data/                 Master Dataset (งานที่ 4)
│   ├── master-data.xlsx  12 ชีต + _README + _summary + menu_verification
│   ├── sample-data.json  ข้อมูลตัวอย่างขนาดเล็ก
│   └── csv/              ส่งออกทุกชีต 12 ไฟล์ (UTF-8 with BOM)
├── images/
│   ├── menus/            ภาพเมนู 98 ไฟล์ + image_credits.csv, README_images.txt
│   └── articles/         ภาพปกบทความ 12 ไฟล์ (ไฟล์ชั่วคราว)
├── icons/                categories/ 8, status/ 7, ui/ 12, NOTICE.txt
├── illustrations/        ภาพประกอบ 4 ไฟล์
├── branding/             โลโก้ 3 ไฟล์
├── fonts/                README-fonts.txt (วิธีใช้ฟอนต์ Sarabun)
├── articles/             โครงเนื้อหาบทความ 12 ไฟล์ (Markdown)
├── firebase/             ข้อมูลและ Security Rules สำหรับ Firebase (งานที่ 5)
│   ├── nutriplan-firebase.json   ไฟล์สำหรับ Import JSON (9 Node)
│   ├── database.rules.json       Security Rules
│   ├── firebase.json             ตั้งค่า Firebase CLI / Emulator
│   ├── check_firebase_json.py    ตรวจคุณภาพ JSON 11 ข้อ
│   ├── json-check-result.json    ผลการตรวจล่าสุด
│   └── test-rules.mjs            ทดสอบ Security Rules กับ Emulator
├── wireframes/           prototype.html (ต้นแบบคลิกได้ 15 หน้าจอ) และ screens/ ภาพ Wireframe 20 ภาพ
├── diagrams/             Use Case, Sitemap, User Flow, โครงสร้างข้อมูล, Component Hierarchy (PNG/SVG) และ source/
├── doc/
│   ├── Assignment 2/     รายงานงานที่ 2 (ข้อเสนอโครงงาน)
│   ├── Assignment 4/     รายงานงานที่ 4 (Data and Digital Asset Design)
│   └── Assignment 5/     รายงานงานที่ 5 (System Design and Prototype)
├── scripts/
│   └── validate.py       ตรวจ Master Dataset 14 กฎ
└── README.md
```

โฟลเดอร์ `images/`, `icons/`, `illustrations/` และ `branding/` ทำหน้าที่เป็นโฟลเดอร์ `public/` ของโปรเจกต์ React เมื่อเริ่มพัฒนาให้คัดลอกทั้ง 4 โฟลเดอร์ไปไว้ใน `public/` โดยไม่ต้องแก้ Path ในข้อมูล

## 2. Dataset (งานที่ 4)

รวม **1,328 แถว**: categories 8, vendor_types 7, activity_levels 5, health_goals 3, nutrient_limits 7, menus 49, articles 12, menu_images 61, sources 18, users 25, user_targets 25, meal_logs 1,108

- ข้อมูลอ้างอิง: categories, vendor_types, activity_levels, health_goals, nutrient_limits
- ข้อมูลหลัก: menus, articles, menu_images, sources, users
- ข้อมูลธุรกรรม: user_targets (คำนวณด้วยสูตร), meal_logs
- users, user_targets และ meal_logs เป็นข้อมูลจำลอง (src_15) สำหรับทดสอบเท่านั้น ไม่นำเข้าฐานข้อมูลจริง
- เมนู หมวด บทความ และเกณฑ์สารอาหาร เป็นชุดเดียวกับ `firebase/nutriplan-firebase.json`

## 3. Digital Assets

| ประเภท | จำนวน | รูปแบบ | ที่มา |
|---|---|---|---|
| ภาพเมนู (thumb 400×300, detail 1200×900) | 98 ไฟล์ (49 เมนู) | WebP | Wikimedia Commons 48 เมนู, Flickr 1 เมนู (src_10) เครดิตรายไฟล์ใน `images/menus/image_credits.csv` |
| ภาพปกบทความ 800×450 | 12 ไฟล์ | WebP | ผู้จัดทำ (src_09) ยังเป็นไฟล์ชั่วคราว |
| ไอคอน | 27 ไฟล์ | SVG | ผู้จัดทำ (src_09) |
| ภาพประกอบ / โลโก้ | 4 / 3 ไฟล์ | SVG | ผู้จัดทำ (src_09) |
| ฟอนต์ Sarabun | 3 น้ำหนัก | – | Google Fonts, SIL OFL 1.1 |

มาตรฐานชื่อไฟล์: ตัวพิมพ์เล็ก ตัวเลข และขีดล่างเท่านั้น เช่น `menu_007_thumb.webp`, `article_03_cover.webp`, `icon_cat_stir.svg`

## 4. วิธีตรวจสอบ

รันจากโฟลเดอร์ `GroupWork_NutriPlan`

```
python scripts/validate.py               ตรวจ Master Dataset 14 กฎ (ตาราง 5.2 งานที่ 4)
python firebase/check_firebase_json.py   ตรวจไฟล์ JSON สำหรับ Firebase 11 ข้อ (หัวข้อ 2.6 งานที่ 5)
```

ผลล่าสุด: validate.py ผ่าน 14/14 กฎ, check_firebase_json.py ผ่าน 11/11 ข้อ และ test-rules.mjs ผ่าน 17/17 กรณี

## 5. วิธีเปิดต้นแบบหน้าจอ

ดับเบิลคลิก `wireframes/prototype.html` เปิดด้วย Chrome, Edge หรือ Safari ไม่ต้องใช้อินเทอร์เน็ต แถบด้านบนใช้เลือกหน้าจอ P01–P15 สลับขนาดเดสก์ท็อป/มือถือ สลับป้ายส่วนหน้าจอหรือป้าย Component และจำลองสถานะกำลังโหลด / ไม่มีข้อมูล / เกิดข้อผิดพลาด

## 6. วิธีนำเข้า Firebase

1. เปิด Firebase Console → Build › Realtime Database → สร้างฐานข้อมูล
2. แท็บ Data → เมนู ⋮ → Import JSON → เลือก `firebase/nutriplan-firebase.json`
3. ตรวจว่ามี Node ระดับบน 9 Node และ `menus` มี 49 รายการ
4. แท็บ Rules → วางเนื้อหาของ `firebase/database.rules.json` → Publish
5. ผลการนำเข้าและ Rules ที่ Publish แล้วอยู่ในรายงานงานที่ 5 ภาพที่ 2.2–2.3 (โปรเจกต์ GroupWork-NutriPlan, asia-southeast1)

Import JSON จะเขียนทับข้อมูลทั้งหมดใน Path ที่เลือก ให้ทำกับฐานข้อมูลของโครงงานนี้เท่านั้น

## 7. วิธีทดสอบ Security Rules ด้วย Emulator

ต้องมี Node.js 18+, Java 11+ และ Firebase CLI (`npm install -g firebase-tools`)

```
cd firebase
firebase emulators:start --only database,auth --project demo-nutriplan
node test-rules.mjs        (เปิดอีกหน้าต่างหนึ่ง)
```

## 8. ข้อจำกัดและสิ่งที่ต้องดำเนินการต่อ

- สอบทานค่าโภชนาการกับ Thai FCD แล้ว 26 เมนู (VERIFIED) ค่าต่อจาน = ค่าต่อ 100 ก. × serving_g รหัสอาหารรายเมนูอยู่ใน `data/csv/menu_verification.csv` อีก 23 เมนูไม่พบใน Thai FCD จึงยังเป็น PENDING
- สารอาหารที่ Thai FCD ไม่รายงาน (ส่วนใหญ่คือน้ำตาล) ยังเป็นค่าประมาณของผู้จัดทำ
- ไฟล์ก่อนแก้ไขรอบสอบทานเก็บไว้ใน `data/backup_2026-10-19/`
- ภาพเมนูมาจากคลังภาพสัญญาอนุญาตเปิด ไม่ใช่ภาพถ่ายของผู้จัดทำ บางภาพเป็นภาพใกล้เคียง (menu_015, menu_048) ต้องแสดงเครดิตเมื่อเผยแพร่ และ menu_027 (CC BY-NC-SA 2.0) ใช้ได้เฉพาะแบบไม่เชิงพาณิชย์
- ภาพปกบทความ 12 ไฟล์ยังเป็นไฟล์ชั่วคราว
