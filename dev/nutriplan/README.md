# NutriPlan (React + Vite + Firebase)

เว็บแอปพลิเคชันให้ความรู้ด้านโภชนาการและวางแผนมื้ออาหารสำหรับอาหารจานเดียวและอาหารตามสั่งของไทย (งานที่ 7)

## เทคโนโลยี

- React 19 + Vite 8 (JavaScript), React Router 7 (Declarative mode)
- Firebase 13 : Authentication (อีเมล/รหัสผ่าน), Realtime Database, Hosting
- Tailwind CSS 4, ฟอนต์ Sarabun (@fontsource/sarabun)

## ติดตั้งและรันบนเครื่อง

```bash
cd dev/nutriplan
npm install
cp .env.example .env      # แล้วกรอกค่าจาก Firebase Console > Project settings > Your apps
npm run dev               # เปิด http://localhost:5173
```

ฐานข้อมูลต้อง Import ไฟล์ `firebase/nutriplan-firebase.json` (ที่รากของ repo) และ Publish `database.rules.json` ก่อน

## คำสั่ง

| คำสั่ง | หน้าที่ |
|---|---|
| `npm run dev` | รันเซิร์ฟเวอร์สำหรับพัฒนา |
| `npm run build` | สร้าง Production Build ในโฟลเดอร์ `dist/` |
| `npm run preview` | เปิดดู Production Build บนเครื่อง |
| `npm run lint` | ตรวจโค้ดด้วย oxlint |
| `firebase deploy --only hosting,database` | Deploy เว็บและ Security Rules |

## Deploy ขึ้น Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
npm run build
firebase deploy --only hosting,database
```

`firebase.json` ตั้งค่า rewrite ทุก Path ไปที่ `index.html` แล้ว เปิด URL ย่อย เช่น `/menus/menu_007` หรือกด Refresh จึงไม่ขึ้น 404

## ตั้งผู้ดูแลข้อมูล (หน้า /admin/menus)

สมัครสมาชิกในแอป แล้วที่ Firebase Console > Realtime Database > Data เพิ่ม `roles/<uid>` = `"editor"` หรือ `"admin"` (ดู uid ได้ที่ Authentication > Users)

## โครงสร้างโฟลเดอร์ (ตามงานที่ 5 หัวข้อ 4.6)

```
src/
├── main.jsx            BrowserRouter + AuthProvider
├── App.jsx
├── routes/             AppRoutes, ProtectedRoute, EditorRoute
├── context/            AuthContext (ผู้ใช้ปัจจุบันและบทบาท)
├── services/           การอ่าน/เขียน Firebase ทั้งหมด
├── hooks/              useRealtime + Hook ของแต่ละข้อมูล
├── utils/              nutrition, planner, validation, format, assetUrl (ฟังก์ชันคำนวณล้วน)
├── components/
│   ├── layout/         AppLayout, Header, NavBar, BottomNav, Footer
│   ├── common/         Button, SearchBar, Breadcrumb, StateView, ImageWithFallback, ProgressBar, DateNavigator, Logo, Icon
│   └── features/       auth, menu, meal, planner, article, admin, survey
├── pages/              15 หน้าตามตาราง Routing + CreditsPage, SurveyPage, AdminSurveyPage
└── styles/index.css    Tailwind
public/                 ภาพเมนู ภาพปกบทความ ไอคอน ภาพประกอบ โลโก้ และ credits/image_credits.json
```

## Routes

| Path | หน้า | สิทธิ์ |
|---|---|---|
| `/` | หน้าแรก | ทุกคน |
| `/menus?category=&veg=&sort=` | รายการเมนู | ทุกคน |
| `/search?q=` | ผลการค้นหา | ทุกคน |
| `/menus/:menuId` | รายละเอียดเมนู | ทุกคน |
| `/login` | เข้าสู่ระบบ / สมัครสมาชิก / ลืมรหัสผ่าน | ทุกคน |
| `/profile` | โปรไฟล์ เป้าหมาย ความยินยอม และลบข้อมูลของฉัน | สมาชิก |
| `/today?date=` | บันทึกมื้ออาหารและสรุปรายวัน | สมาชิก |
| `/planner` | วางแผนมื้ออาหาร | สมาชิก |
| `/articles?topic=` | รายการบทความ | ทุกคน |
| `/articles/:articleId` | รายละเอียดบทความ | ทุกคน |
| `/favorites` | เมนูโปรด | สมาชิก |
| `/weekly?end=` | สรุปรายสัปดาห์ | สมาชิก |
| `/admin/menus` | ตารางจัดการเมนู | editor / admin |
| `/admin/menus/new`, `/admin/menus/:menuId/edit` | ฟอร์มเพิ่ม/แก้ไขเมนู | editor / admin |
| `/credits` | เครดิตภาพและแหล่งข้อมูล | ทุกคน |
| `/survey` | แบบสอบถามความพึงพอใจ (10 ข้อ, มาตรา 1–5) | สมาชิก |
| `/admin/survey` | สรุปผลแบบสอบถาม และดาวน์โหลด CSV | editor / admin |
| `*` | ไม่พบหน้า | ทุกคน |
