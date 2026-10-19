# GroupWork_NutriPlan

โครงงาน **NutriPlan** ระบบให้ความรู้ด้านโภชนาการและวางแผนมื้ออาหารสำหรับอาหารจานเดียวและอาหารตามสั่งของไทย
(Nutrition Literacy and Meal Planning System for Thai Single-dish and Made-to-order Meals)

**เว็บไซต์ :** https://groupwork-nutriplan.web.app

| | |
|---|---|
| รายวิชา | CSD3202 การพัฒนาเว็บแอปพลิเคชัน ภาคเรียนที่ 1/2569 |
| ผู้จัดทำ | นาย กิตติภัฎ ท่าห้อง (66122250094) |
| อาจารย์ผู้สอน | ผศ. เสถียร จันทร์ปลา |
| เทคโนโลยี | React 19 + Vite 8, React Router 7, Tailwind CSS 4, Firebase Authentication, Firebase Realtime Database, Firebase Hosting |

Repository นี้รวมผลงานงานที่ 2 (ข้อเสนอโครงงาน) งานที่ 4 (Data and Digital Asset Design) งานที่ 5 (System Design and Prototype) และงานที่ 7 (Web Application Development, Testing, and Presentation) ทุกงานใช้รหัสข้อมูลชุดเดียวกัน ได้แก่ ฟังก์ชัน F01–F09 หน้าจอ P01–P15 และรหัสข้อมูล เช่น `menu_007`, `cat_stir`

## 1. โครงสร้าง Folder

```
groupwork-nutriplan/
├── dev/
│   └── nutriplan/        เว็บแอปพลิเคชัน React + Firebase (งานที่ 7) ดู dev/nutriplan/README.md
│       ├── src/          routes, context, services, hooks, utils, components, pages, styles
│       ├── public/       ภาพเมนู ภาพปกบทความ ไอคอน ภาพประกอบ โลโก้ และเครดิตภาพ
│       ├── database.rules.json   Security Rules ที่ Deploy จริง
│       ├── firebase.json, .firebaserc   ตั้งค่า Firebase Hosting และ Database
│       └── .env.example  รายชื่อตัวแปร VITE_FIREBASE_* (ไม่มีค่าจริง)
├── data/                 Master Dataset (งานที่ 4)
│   ├── master-data.xlsx  12 ชีต + menu_verification + _README + _summary
│   ├── sample-data.json  ข้อมูลตัวอย่างขนาดเล็ก
│   └── csv/              ส่งออกทุกชีต 13 ไฟล์ (UTF-8 with BOM)
├── images/
│   ├── menus/            ภาพเมนู 98 ไฟล์ + image_credits.csv, README_images.txt
│   └── articles/         ภาพปกบทความ 12 ไฟล์
├── icons/                categories/ 8, status/ 7, ui/ 12, NOTICE.txt
├── illustrations/        ภาพประกอบ 4 ไฟล์
├── branding/             โลโก้ 3 ไฟล์
├── fonts/                README-fonts.txt (วิธีใช้ฟอนต์ Sarabun)
├── articles/             โครงเนื้อหาบทความ 12 ไฟล์ (Markdown)
├── firebase/             ข้อมูลและเครื่องมือตรวจสอบสำหรับ Firebase (งานที่ 5)
│   ├── nutriplan-firebase.json   ไฟล์สำหรับ Import JSON (9 Node)
│   ├── database.rules.json       Security Rules ฉบับงานที่ 5 (ใช้กับ Emulator)
│   ├── firebase.json             ตั้งค่า Firebase Emulator
│   ├── check_firebase_json.py    ตรวจคุณภาพ JSON 11 ข้อ
│   ├── json-check-result.json    ผลการตรวจล่าสุด
│   └── test-rules.mjs            ทดสอบ Security Rules กับ Emulator
├── wireframes/           prototype.html (ต้นแบบคลิกได้ 15 หน้าจอ) และ screens/ ภาพ Wireframe 20 ภาพ
├── diagrams/             Use Case, Sitemap, User Flow, โครงสร้างข้อมูล, Component Hierarchy (PNG/SVG) และ source/
├── doc/
│   ├── Assignment 2/     รายงานงานที่ 2 (ข้อเสนอโครงงาน)
│   ├── Assignment 4/     รายงานงานที่ 4 (Data and Digital Asset Design)
│   ├── Assignment 5/     รายงานงานที่ 5 (System Design and Prototype)
│   └── Assignment 7/     โจทย์และรายงานงานที่ 7 (Web Application Development, Testing, and Presentation)
├── scripts/
│   └── validate.py       ตรวจ Master Dataset 14 กฎ
└── README.md
```

ภาพและไอคอนในโฟลเดอร์ `images/`, `icons/`, `illustrations/` และ `branding/` ถูกคัดลอกไปไว้ใน `dev/nutriplan/public/` แล้ว Path ในข้อมูล (เช่น `images/menus/menu_007_thumb.webp`) จึงใช้ในเว็บได้โดยไม่ต้องแก้

## 2. เว็บแอปพลิเคชัน (งานที่ 7)

| | |
|---|---|
| URL | https://groupwork-nutriplan.web.app |
| Source Code | [`dev/nutriplan/`](dev/nutriplan) |
| ฟังก์ชัน | F01–F09 ครบทุกฟังก์ชัน : สมัครสมาชิก/เข้าสู่ระบบ/ลืมรหัสผ่าน ค้นหาและดูข้อมูลโภชนาการ คำนวณเป้าหมาย บันทึกมื้ออาหาร วางแผนมื้ออาหารตามงบ บทความ เมนูโปรด สรุปรายสัปดาห์ และจัดการเมนูสำหรับผู้ดูแลข้อมูล |
| หน้าจอ | 15 หน้าตามงานที่ 5 และหน้าเครดิตภาพ `/credits` |

ติดตั้งและรันบนเครื่อง (ต้องมี Node.js LTS)

```
cd dev/nutriplan
npm install
cp .env.example .env      แล้วกรอกค่าจาก Firebase Console > Project settings > Your apps
npm run dev               เปิด http://localhost:5173
```

Build และ Deploy

```
cd dev/nutriplan
npm run build
firebase deploy --only hosting,database
```

รายละเอียดคำสั่ง ตาราง Route และวิธีตั้งผู้ดูแลข้อมูลอยู่ใน [`dev/nutriplan/README.md`](dev/nutriplan/README.md)

## 3. Dataset (งานที่ 4)

รวม **1,330 แถว**: categories 8, vendor_types 7, activity_levels 5, health_goals 3, nutrient_limits 7, menus 49, articles 12, menu_images 61, sources 20, users 25, user_targets 25, meal_logs 1,108 และมีชีต/ไฟล์ `menu_verification` 49 แถว บันทึกผลสอบทานค่าโภชนาการรายเมนู

- ข้อมูลอ้างอิง: categories, vendor_types, activity_levels, health_goals, nutrient_limits
- ข้อมูลหลัก: menus, articles, menu_images, sources, users
- ข้อมูลธุรกรรม: user_targets (คำนวณด้วยสูตร), meal_logs
- users, user_targets และ meal_logs เป็นข้อมูลจำลอง (src_15) สำหรับทดสอบเท่านั้น ไม่นำเข้าฐานข้อมูลจริง ข้อมูลผู้ใช้ในเว็บจริงสร้างขึ้นระหว่างใช้งานและผูกกับ uid ของ Firebase Authentication
- เมนู หมวด บทความ และเกณฑ์สารอาหาร เป็นชุดเดียวกับ `firebase/nutriplan-firebase.json`

## 4. Digital Assets

| ประเภท | จำนวน | รูปแบบ | ที่มา |
|---|---|---|---|
| ภาพเมนู (thumb 400×300, detail 1200×900) | 98 ไฟล์ (49 เมนู) | WebP | Wikimedia Commons 48 เมนู, Flickr 1 เมนู (src_10) เครดิตรายไฟล์ใน `images/menus/image_credits.csv` และหน้า `/credits` ของเว็บ |
| ภาพปกบทความ 800×450 | 12 ไฟล์ | WebP | ภาพประกอบสร้างด้วย AI (src_09) ไม่ใช่ภาพถ่ายอาหารจริง รายละเอียดใน `images/articles/README_TH.md` |
| ไอคอน | 27 ไฟล์ | SVG | ผู้จัดทำ + AI ช่วยสร้าง (src_09) |
| ภาพประกอบ / โลโก้ | 4 / 3 ไฟล์ | SVG | ผู้จัดทำ + AI ช่วยสร้าง (src_09) |
| ฟอนต์ Sarabun | 3 น้ำหนัก | – | Google Fonts, SIL OFL 1.1 (ติดตั้งในเว็บด้วย `@fontsource/sarabun`) |

มาตรฐานชื่อไฟล์: ตัวพิมพ์เล็ก ตัวเลข และขีดล่างเท่านั้น เช่น `menu_007_thumb.webp`, `article_03_cover.webp`, `icon_cat_stir.svg`

## 5. วิธีตรวจสอบข้อมูล

รันจากรากของ Repository

```
python scripts/validate.py               ตรวจ Master Dataset 14 กฎ (ตาราง 5.2 งานที่ 4)
python firebase/check_firebase_json.py   ตรวจไฟล์ JSON สำหรับ Firebase 11 ข้อ (หัวข้อ 2.6 งานที่ 5)
```

ผลล่าสุด: validate.py ผ่าน 14/14 กฎ, check_firebase_json.py ผ่าน 11/11 ข้อ และ test-rules.mjs ผ่าน 17/17 กรณี

## 6. วิธีเปิดต้นแบบหน้าจอ (งานที่ 5)

ดับเบิลคลิก `wireframes/prototype.html` เปิดด้วย Chrome, Edge หรือ Safari ไม่ต้องใช้อินเทอร์เน็ต แถบด้านบนใช้เลือกหน้าจอ P01–P15 สลับขนาดเดสก์ท็อป/มือถือ สลับป้ายส่วนหน้าจอหรือป้าย Component และจำลองสถานะกำลังโหลด / ไม่มีข้อมูล / เกิดข้อผิดพลาด

## 7. วิธีตั้งค่า Firebase

1. Firebase Console → Realtime Database → สร้างฐานข้อมูล (Singapore, asia-southeast1)
2. แท็บ Data → เมนู ⋮ → Import JSON → เลือก `firebase/nutriplan-firebase.json`
3. ตรวจว่ามี Node ระดับบน 9 Node และ `menus` มี 49 รายการ
4. แท็บ Rules → วางเนื้อหาของ `dev/nutriplan/database.rules.json` → Publish (หรือรัน `firebase deploy --only database` ใน `dev/nutriplan`)
5. Authentication → Sign-in method → เปิด Email/Password
6. กำหนดผู้ดูแลข้อมูล : เพิ่ม `roles/<uid>` = `"editor"` หรือ `"admin"` ในแท็บ Data

Import JSON จะเขียนทับข้อมูลทั้งหมดใน Path ที่เลือก ให้ทำกับฐานข้อมูลของโครงงานนี้เท่านั้น

## 8. วิธีทดสอบ Security Rules ด้วย Emulator

ต้องมี Node.js 18+, Java 11+ และ Firebase CLI (`npm install -g firebase-tools`)

```
cd firebase
firebase emulators:start --only database,auth --project demo-nutriplan
node test-rules.mjs        (เปิดอีกหน้าต่างหนึ่ง)
```

## 9. ข้อจำกัด

- ค่าโภชนาการเป็นค่าต่อจาน สอบทานครบ 49 เมนู (VERIFIED): 26 เมนูจากรายการใน Thai FCD (src_01) และ 23 เมนูคำนวณจากสูตรอาหารด้วยค่าส่วนประกอบจาก Thai FCD, USDA FoodData Central (src_19) และ ASEAN Food Composition Database (src_20) ที่มาของค่ารายเมนูอยู่ใน `data/csv/menu_verification.csv` และภาคผนวก จ–ฉ ของรายงานงานที่ 4 ปริมาณส่วนประกอบในสูตรเป็นค่าประมาณจานขายทั่วไป และค่าน้ำตาลบางรายการยังเป็นค่าประมาณเดิม
- ภาพเมนูมาจากคลังภาพสัญญาอนุญาตเปิด ไม่ใช่ภาพถ่ายของผู้จัดทำ บางภาพเป็นภาพใกล้เคียง (menu_015, menu_048) เว็บแสดงเครดิตครบที่หน้า `/credits` และ menu_027 (CC BY-NC-SA 2.0) ใช้ได้เฉพาะแบบไม่เชิงพาณิชย์
- ข้อมูลในระบบใช้เพื่อการเรียนรู้ ไม่ใช่คำแนะนำทางการแพทย์
