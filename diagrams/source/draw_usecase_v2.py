# -*- coding: utf-8 -*-
"""Use Case Diagram ฉบับปรับปรุง (งานที่ 5) : F01–F09 แยก Core / Supporting และใช้ Actor Generalization"""
from PIL import Image, ImageDraw, ImageFont
import math

S = 2
W, H = 1720, 1400
REG = "/usr/share/fonts/truetype/tlwg/Garuda.ttf"
BOLD = "/usr/share/fonts/truetype/tlwg/Garuda-Bold.ttf"
NAVY, INK, LINE, GREY = (31, 78, 121), (26, 32, 44), (90, 100, 115), (120, 128, 140)
img = Image.new("RGB", (W*S, H*S), "white")
d = ImageDraw.Draw(img)
F = lambda size, b=False: ImageFont.truetype(BOLD if b else REG, int(size*S))

def text(x, y, s, size=20, bold=False, fill=INK, anchor="mm"):
    d.text((x*S, y*S), s, font=F(size, bold), fill=fill, anchor=anchor)
def line(p1, p2, w=2, fill=LINE):
    d.line([p1[0]*S, p1[1]*S, p2[0]*S, p2[1]*S], fill=fill, width=int(w*S))
def dashed(pts, w=2, dash=13, gap=8, fill=LINE):
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        dist = math.hypot(x2-x1, y2-y1); k = 0
        while k*(dash+gap) < dist:
            t0 = k*(dash+gap)/dist; t1 = min((k*(dash+gap)+dash)/dist, 1)
            line((x1+(x2-x1)*t0, y1+(y2-y1)*t0), (x1+(x2-x1)*t1, y1+(y2-y1)*t1), w, fill); k += 1
def open_arrow(p_from, p_to, size=16, fill=LINE):
    a = math.atan2(p_to[1]-p_from[1], p_to[0]-p_from[0])
    for sg in (1, -1):
        b = a + sg*math.radians(24)
        line(p_to, (p_to[0]-size*math.cos(b), p_to[1]-size*math.sin(b)), 2, fill)
def hollow_triangle(tip, from_pt, size=22):
    a = math.atan2(tip[1]-from_pt[1], tip[0]-from_pt[0])
    p1 = (tip[0]-size*math.cos(a-math.radians(28)), tip[1]-size*math.sin(a-math.radians(28)))
    p2 = (tip[0]-size*math.cos(a+math.radians(28)), tip[1]-size*math.sin(a+math.radians(28)))
    d.polygon([(tip[0]*S, tip[1]*S), (p1[0]*S, p1[1]*S), (p2[0]*S, p2[1]*S)], fill="white", outline=INK)
    d.line([tip[0]*S, tip[1]*S, p1[0]*S, p1[1]*S, p2[0]*S, p2[1]*S, tip[0]*S, tip[1]*S], fill=INK, width=2*S)
    return ((p1[0]+p2[0])/2, (p1[1]+p2[1])/2)

def actor(cx, cy, th, en):
    r = 22
    d.ellipse([(cx-r)*S, (cy-60)*S, (cx+r)*S, (cy-60+2*r)*S], outline=INK, width=3*S)
    line((cx, cy-16), (cx, cy+34), 3, INK); line((cx-34, cy+2), (cx+34, cy+2), 3, INK)
    line((cx, cy+34), (cx-28, cy+80), 3, INK); line((cx, cy+34), (cx+28, cy+80), 3, INK)
    text(cx, cy+104, th, 21, True); text(cx, cy+132, "(%s)" % en, 18, False, (70, 80, 95))

# กรอบระบบ
d.rounded_rectangle([420*S, 70*S, 1480*S, 1290*S], radius=18*S, outline=NAVY, fill=(242, 247, 252), width=3*S)
text(950, 104, "NutriPlan : ขอบเขตการพัฒนาในรายวิชา (งานที่ 5)", 24, True, NAVY)

UC = {}
def usecase(code, label, cy, core=True, cx=800, rx=285, ry=50):
    box = [(cx-rx)*S, (cy-ry)*S, (cx+rx)*S, (cy+ry)*S]
    if core:
        d.ellipse(box, outline=NAVY, fill="white", width=3*S)
    else:
        d.ellipse(box, outline=None, fill=(250, 250, 250))
        # เส้นขอบประสำหรับ Supporting
        n = 90
        for i in range(0, n, 2):
            a0, a1 = 2*math.pi*i/n, 2*math.pi*(i+1)/n
            line((cx+rx*math.cos(a0), cy+ry*math.sin(a0)), (cx+rx*math.cos(a1), cy+ry*math.sin(a1)), 2.4, GREY)
    text(cx, cy-15, code + ("  · Core" if core else "  · Supporting"), 18, True, NAVY if core else GREY)
    text(cx, cy+16, label, 19, False, INK)
    UC[code] = (cx, cy, rx, ry)

usecase("F01", "สมัครสมาชิกและเข้าสู่ระบบ", 180)
usecase("F02", "ค้นหาและดูข้อมูลโภชนาการของเมนู", 300)
usecase("F06", "อ่านบทความให้ความรู้", 420, core=False)
usecase("F04", "บันทึกมื้ออาหารและดูสรุปรายวัน", 560)
usecase("F05", "วางแผนมื้ออาหารตามงบประมาณ", 680)
usecase("F03", "ตั้งค่าโปรไฟล์และคำนวณเป้าหมาย", 800)
usecase("F07", "จัดการเมนูโปรด", 920, core=False)
usecase("F08", "ดูสรุปรายสัปดาห์", 1040, core=False)
usecase("F09", "จัดการข้อมูลเมนูและค่าโภชนาการ", 1195, core=False)

actor(215, 330, "ผู้ใช้ทั่วไป", "Guest")
actor(215, 800, "สมาชิก", "Member")
actor(215, 1150, "ผู้ดูแลข้อมูล", "Content Editor")

def assoc(ax, ay, code):
    cx, cy, rx, ry = UC[code]
    line((ax, ay), (cx-rx+4, cy))
for c in ("F01", "F06", "F02"):
    assoc(262, 332, c)
for c in ("F04", "F05", "F03", "F07", "F08"):
    assoc(262, 802, c)
assoc(262, 1152, "F09")

# Generalization : Member → Guest, Editor → Member  (ลูกศรหัวสามเหลี่ยมโปร่ง ชี้ไปยัง Actor แม่)
base = hollow_triangle((150, 470), (150, 740)); line((150, 740), base, 2, INK); line((150, 740), (193, 740), 2, INK)
base = hollow_triangle((150, 940), (150, 1090)); line((150, 1090), base, 2, INK); line((150, 1090), (193, 1090), 2, INK)
text(98, 605, "generalization", 15, False, GREY, anchor="mm")

# «include» / «extend»
def on(code, deg):
    cx, cy, rx, ry = UC[code]; t = math.radians(deg)
    return (cx + rx*math.cos(t), cy + ry*math.sin(t))
def rel(src, sdeg, dst, ddeg, bulge_xy, label, lx, ly=None, anchor="lm"):
    p0, p2 = on(src, sdeg), on(dst, ddeg)
    dashed([p0, bulge_xy, p2]); open_arrow(bulge_xy, p2, 18)
    text(lx, ly if ly is not None else bulge_xy[1], label, 16, False, (70, 80, 95), anchor=anchor)
rel("F04", 0, "F02", 12, (1255, 430), "«include»", 1265)
rel("F06", 0, "F04", -38, (1150, 492), "«extend»", 1062, 486, "rm")
rel("F05", 0, "F03", 0, (1195, 740), "«include»", 1205)

# คำอธิบายสัญลักษณ์
ly = 1335
d.ellipse([440*S, (ly-16)*S, 520*S, (ly+16)*S], outline=NAVY, width=3*S); text(530, ly, "Core : ต้องพัฒนาให้เสร็จ", 16, anchor="lm")
for i in range(0, 60, 2):
    a0, a1 = 2*math.pi*i/60, 2*math.pi*(i+1)/60
    line((870+40*math.cos(a0), ly+16*math.sin(a0)), (870+40*math.cos(a1), ly+16*math.sin(a1)), 2.2, GREY)
text(920, ly, "Supporting : พัฒนาหลัง Core", 16, anchor="lm")
text(1210, ly, "F06 «extend» F04 = คำเตือนเชื่อมไปยังบทความ", 15, False, GREY, anchor="lm")

img.resize((W, H), Image.LANCZOS).save("/home/claude/proj/Group00_NutriPlan_Assignment05/diagrams/usecase_v2.png")
print("ok")
