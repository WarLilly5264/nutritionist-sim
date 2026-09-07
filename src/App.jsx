import { useState, useEffect } from 'react';
import './App.css';

// ชุดสีพาสเทลสำหรับสุ่มปุ่มตัวเลือก
const buttonColors = [
  { bg: '#a29bfe', border: '#6c5ce7' },
  { bg: '#fab1a0', border: '#e17055' },
  { bg: '#81ecec', border: '#00cec9' },
  { bg: '#55efc4', border: '#00b894' },
  { bg: '#ffeaa7', border: '#fdcb6e' },
  { bg: '#ff7675', border: '#d63031' }
];

// ข้อมูล 5 เคส พร้อมคลังคำตอบเคสละ 9 ตัวเลือก (แยกหมวด)
const gameCases = [
  {
    id: 1,
    name: "ต้น (นักฟุตบอล)",
    avatar: "⚽",
    trait: "ใจร้อน, แอบกินของทอดประจำ",
    history: "อีก 2 ชม. จะลงแข่งสนามใหญ่ รู้อยู่แล้วว่าชอบกินของทอด แต่ต้องการพลังงานด่วนโดยไม่จุก",
    secretInfo: "⚠️ กรดในกระเพาะอาหารสูง: ควรงดไขมันและไฟเบอร์สูง เพราะใช้เวลาย่อยนาน",
    initialStats: { health: 70, fit: 80, perf: 50, mood: 40 },
    optionsPool: {
      good: [
        { text: "จัดมื้อ 'ข้าวขาว + กล้วยหอม'", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 20, fit: 5, mood: -10, health: 0 }, feedback: "✅ ถูกต้อง! คาร์บเชิงซ้อนย่อยง่ายและกล้วยช่วยให้พลังงานทันที" },
        { text: "ขนมปังขาวทาแยมผลไม้ + น้ำเปล่า", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 15, fit: 5, mood: -5, health: 0 }, feedback: "✅ เยี่ยม! ขนมปังขาวกากใยต่ำ ย่อยเป็นน้ำตาลไปใช้เป็นพลังงานได้ไวมาก ไม่จุกท้อง" },
        { text: "สมูทตี้ผลไม้ล้วน (ไม่ใส่นม) + แครกเกอร์", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 20, fit: 5, mood: 5, health: 0 }, feedback: "✅ ดีมาก! ผลไม้ปั่นดูดซึมไว ให้พลังงานทันที ต้นชอบรสชาติด้วย" }
      ],
      bad: [
        { text: "ยอมตามใจจัด 'ไก่ทอด + น้ำอัดลม'", playerEffect: { cred: -10, know: 0 }, athleteEffect: { perf: -20, fit: 0, mood: 30, health: -10 }, feedback: "❌ ผิดเต็มๆ! ไขมันทอดทำให้กรดไหลย้อน ต้นวิ่งไม่ออก โค้ชด่ายับ!" },
        { text: "หมูกรอบ + ชานมไข่มุก", playerEffect: { cred: -10, know: 0 }, athleteEffect: { perf: -25, fit: 0, mood: 40, health: -15 }, feedback: "❌ พังพินาศ! ไขมันและน้ำตาลล้นกระเพาะ ต้นจุกเสียดจนต้องขอเปลี่ยนตัวออก" },
        { text: "พิซซ่าหน้าชีสเยิ้มๆ 3 ชิ้น", playerEffect: { cred: -10, know: 0 }, athleteEffect: { perf: -20, fit: 0, mood: 20, health: -10 }, feedback: "❌ แย่มาก! ชีสย่อยยากมาก ต้นวิ่งไปเรอไป จุกจนหน้าซีด" }
      ],
      trick: [
        { text: "สลัดผักรวมชามโต + อกไก่", playerEffect: { cred: -5, know: 5 }, athleteEffect: { perf: -15, fit: 5, mood: -10, health: 10 }, feedback: "❌ ข้อหลอก! ไฟเบอร์สูงมากใช้เวลาย่อยนาน (ความรู้: 1-2 ชม. ก่อนแข่ง ควรงดไฟเบอร์สูง)" },
        { text: "ข้าวกล้อง + ถั่วอัลมอนด์", playerEffect: { cred: -5, know: 5 }, athleteEffect: { perf: -10, fit: 5, mood: -5, health: 5 }, feedback: "❌ ข้อหลอก! ข้าวกล้องและถั่วดีต่อสุขภาพ แต่ไขมันและกากใยย่อยช้าไปสำหรับก่อนลงแข่ง" },
        { text: "สเต็กปลาแซลมอนชิ้นใหญ่", playerEffect: { cred: -5, know: 5 }, athleteEffect: { perf: -15, fit: 5, mood: 10, health: 5 }, feedback: "❌ ข้อหลอก! โปรตีนและไขมันดีจากปลาใช้เวลาย่อยนานกว่า 3-4 ชม. กินตอนนี้จุกแน่นอน" }
      ]
    }
  },
  {
    id: 2,
    name: "เมย์ (นักแบดมินตัน)",
    avatar: "🏸",
    trait: "วิตกกังวลสูง, แพ้นมวัว",
    history: "แข่งเสร็จมื้อเย็น ร่างกายล้ามาก ต้องการอาหารซ่อมแซมกล้ามเนื้อภายใน 30 นาที",
    secretInfo: "⚠️ ตรวจพบภูมิไวรับ: ร่างกายไม่มีเอนไซม์ย่อยแลคโตสในนมวัว",
    initialStats: { health: 40, fit: 50, perf: 50, mood: 30 },
    optionsPool: {
      good: [
        { text: "อกไก่ + ข้าวสวย + น้ำมะพร้าว", playerEffect: { cred: 10, know: 10 }, athleteEffect: { health: 30, fit: 20, mood: 20, perf: 10 }, feedback: "✅ เป๊ะมาก! น้ำมะพร้าวคืนเกลือแร่ อกไก่และข้าวสวยซ่อมแซมกล้ามเนื้อโดยไม่มีแลคโตส" },
        { text: "โปรตีนถั่วเหลือง (Soy) + กล้วยหอม", playerEffect: { cred: 10, know: 10 }, athleteEffect: { health: 25, fit: 20, mood: 15, perf: 10 }, feedback: "✅ ถูกต้อง! โปรตีนพืชปลอดภัยต่อคนแพ้นมวัว และกล้วยเติมไกลโคเจนกลับเข้ากล้ามเนื้อ" },
        { text: "ข้าวเหนียวหมูปิ้ง (มันน้อย) + น้ำส้ม", playerEffect: { cred: 10, know: 10 }, athleteEffect: { health: 20, fit: 15, mood: 25, perf: 10 }, feedback: "✅ ทางเลือกที่ดี! หาซื้อง่าย ได้คาร์บและโปรตีนรวดเร็ว แถมช่วยให้เมย์อารมณ์ดีขึ้นด้วย" }
      ],
      bad: [
        { text: "เวย์โปรตีนผสมนมวัว", playerEffect: { cred: -15, know: 0 }, athleteEffect: { health: -30, perf: -20, mood: -20, fit: -10 }, feedback: "❌ พลาดแรง! เมย์แพ้นมวัว ท้องเสียหนักจนร่างกายทรุด" },
        { text: "ช็อกโกแลตซันเดย์ราดนมข้น", playerEffect: { cred: -15, know: 0 }, athleteEffect: { health: -25, perf: -20, mood: 10, fit: -10 }, feedback: "❌ แย่มาก! นอกจากแลคโตสทำท้องเสียแล้ว น้ำตาลเพียวๆ ไม่ได้ช่วยซ่อมแซมกล้ามเนื้อเลย" },
        { text: "โกโก้ปั่นใส่นมสดแก้วใหญ่", playerEffect: { cred: -15, know: 0 }, athleteEffect: { health: -30, perf: -15, mood: 5, fit: -10 }, feedback: "❌ นมสดคือยาพิษของคนแพ้แลคโตส! เมย์ท้องเสียจนหมดแรง" }
      ],
      trick: [
        { text: "ผลไม้ตระกูลเบอร์รี่ + นมอัลมอนด์", playerEffect: { cred: 0, know: 5 }, athleteEffect: { health: 10, perf: -10, mood: 10, fit: -5 }, feedback: "❌ ข้อหลอก! วิตามินดี แต่คาร์บและโปรตีนน้อยเกินไปสำหรับซ่อมแซมกล้ามเนื้อหลังแข่งหนัก" },
        { text: "สลัดผักน้ำใส 1 จานใหญ่", playerEffect: { cred: 0, know: 5 }, athleteEffect: { health: 10, perf: -10, mood: -5, fit: -10 }, feedback: "❌ ข้อหลอก! กินสลัดตอนล้า ไม่ได้ให้พลังงานและโปรตีนในการซ่อมแซมกล้ามเนื้อเลย" },
        { text: "ดื่มแค่น้ำแร่เย็นจัด 2 ลิตร", playerEffect: { cred: -5, know: 5 }, athleteEffect: { health: -10, perf: -15, mood: -5, fit: -10 }, feedback: "❌ ข้อหลอก! น้ำแร่อย่างเดียวไม่พอ ร่างกายเข้าสู่ภาวะสลายกล้ามเนื้อเพราะไม่ได้สารอาหาร" }
      ]
    }
  },
  {
    id: 3,
    name: "บาส (นักบาสเกตบอล)",
    avatar: "🏀",
    trait: "เป็นตะคริวบ่อยช่วงครึ่งหลัง",
    history: "แข่งกลางแจ้ง เสียเหงื่อเยอะมาก มาปรึกษาเรื่องการเติมน้ำและเกลือแร่",
    secretInfo: "⚠️ ภาวะโซเดียมต่ำ: ดื่มแค่น้ำเปล่ารวดเดียวจะทำให้เกลือแร่เจือจาง",
    initialStats: { health: 60, fit: 70, perf: 40, mood: 50 },
    optionsPool: {
      good: [
        { text: "น้ำเกลือแร่สำหรับนักกีฬา + กล้วยหอม", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 30, health: 15, fit: 10, mood: 10 }, feedback: "✅ ถูกต้อง! โซเดียมในน้ำเกลือแร่และโพแทสเซียมในกล้วยช่วยป้องกันตะคริวได้ชะงัด" },
        { text: "น้ำส้มคั้นผสมเกลือป่นเล็กน้อย + แตงโม", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 25, health: 20, fit: 5, mood: 20 }, feedback: "✅ ดีมาก! เป็นวิธีเติมเกลือแร่ธรรมชาติ แตงโมมีน้ำเยอะและช่วยลดความร้อนในร่างกายได้ดี" },
        { text: "เครื่องดื่มอิเล็กโทรไลต์แบบผงชงน้ำ", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 25, health: 15, fit: 10, mood: 5 }, feedback: "✅ ถูกหลักวิชาการ! การดูดซึมเร็ว ช่วยรักษาสมดุลเกลือแร่ในเลือด บาสเล่นได้จนจบเรซ" }
      ],
      bad: [
        { text: "ดื่มน้ำเปล่าเย็นจัด 1 ลิตร ทีเดียว", playerEffect: { cred: -10, know: 0 }, athleteEffect: { perf: -15, health: -15, fit: 0, mood: -10 }, feedback: "❌ อันตราย! เกลือแร่เจือจางฉับพลัน บาสจุกและตะคริวกินหนักกว่าเดิม" },
        { text: "ดื่มกาแฟเย็นแก้วใหญ่", playerEffect: { cred: -10, know: 0 }, athleteEffect: { perf: -20, health: -10, fit: 0, mood: 10 }, feedback: "❌ ผิดมหันต์! คาเฟอีนขับน้ำออกจากร่างกาย (Diuretic) ยิ่งทำให้ขาดน้ำและตะคริวกิน" },
        { text: "ดื่มเบียร์เย็นๆ ดับกระหาย", playerEffect: { cred: -15, know: 0 }, athleteEffect: { perf: -30, health: -20, fit: -10, mood: 30 }, feedback: "❌ พัง! แอลกอฮอล์ทำให้ร่างกายเสียสมดุลน้ำอย่างหนัก บาสหน้ามืดล้มกลางสนาม!" }
      ],
      trick: [
        { text: "น้ำอัดลมเกลือแร่ (สูตรซ่า)", playerEffect: { cred: -5, know: 5 }, athleteEffect: { perf: -10, health: -5, fit: 0, mood: 20 }, feedback: "❌ ข้อหลอก! มีเกลือแร่จริง แต่แก๊สทำให้จุกเสียดแน่นท้องระหว่างวิ่ง" },
        { text: "น้ำแร่บริสุทธิ์จากเทือกเขา", playerEffect: { cred: -5, know: 5 }, athleteEffect: { perf: -10, health: -5, fit: 0, mood: 5 }, feedback: "❌ ข้อหลอก! น้ำแร่มีแร่ธาตุจริง แต่น้อยเกินไป ไม่พอชดเชยโซเดียมที่เสียไปกับเหงื่อจำนวนมาก" },
        { text: "นมช็อกโกแลตเย็น", playerEffect: { cred: -5, know: 5 }, athleteEffect: { perf: -15, health: 0, fit: 0, mood: 15 }, feedback: "❌ ข้อหลอก! นมช็อกโกแลตดีสำหรับการฟื้นฟู 'หลังแข่ง' แต่กินตอนเหงื่อท่วมกลางเกมจะทำให้จุกและย่อยไม่ทัน" }
      ]
    }
  },
  {
    id: 4,
    name: "กาย (นักเพาะกาย)",
    avatar: "🏋️",
    trait: "มีวินัยสูงมาก, ซีเรียสเรื่องมวลกล้ามเนื้อ",
    history: "ต้องการฟื้นฟูกล้ามเนื้อและสร้างความแข็งแรงระยะยาว",
    secretInfo: "⚠️ การอักเสบระดับไมโคร: ต้องการวิตามิน/แร่ธาตุธรรมชาติร่วมด้วย",
    initialStats: { health: 80, fit: 90, perf: 70, mood: 70 },
    optionsPool: {
      good: [
        { text: "โปรตีนธรรมชาติ (ไข่ต้ม, อกไก่) สลับตามมื้อ", playerEffect: { cred: 10, know: 10 }, athleteEffect: { fit: 10, health: 10, mood: 10, perf: 10 }, feedback: "✅ ยอดเยี่ยม! สารอาหารหลักที่ครบถ้วนช่วยสังเคราะห์โปรตีนได้สมบูรณ์แบบ" },
        { text: "เนื้อวัวไม่ติดมัน + บรอกโคลี + ข้าวกล้อง", playerEffect: { cred: 10, know: 10 }, athleteEffect: { fit: 15, health: 10, mood: 5, perf: 10 }, feedback: "✅ ดีมาก! ครีเอทีนธรรมชาติในเนื้อวัวช่วยเพิ่มพลัง และบรอกโคลีให้วิตามินฟื้นฟู" },
        { text: "แซลมอนย่าง + หน่อไม้ฝรั่ง + มันเทศ", playerEffect: { cred: 10, know: 10 }, athleteEffect: { fit: 10, health: 15, mood: 15, perf: 5 }, feedback: "✅ ตัวเลือกที่ดีมาก! โอเมก้า 3 ในปลาช่วยลดการอักเสบของกล้ามเนื้อได้ดีเยี่ยม" }
      ],
      bad: [
        { text: "กิน 'อาหารเสริมสังเคราะห์ งดมื้อหลัก'", playerEffect: { cred: -10, know: 0 }, athleteEffect: { health: -30, fit: -10, mood: -20, perf: -10 }, feedback: "❌ ผิดหลัก! ขาดวิตามินแร่ธาตุหลัก ร่างกายเครียดและโทรมลง" },
        { text: "ฟาสต์ฟู้ดเน้นๆ ขอแค่แคลอรี่ถึงก็พอ", playerEffect: { cred: -15, know: 0 }, athleteEffect: { health: -20, fit: -5, mood: 20, perf: -15 }, feedback: "❌ แย่มาก! ไขมันทรานส์และโซเดียมมหาศาล ทำให้กล้ามเนื้อบวมน้ำ (Dirty Bulking แบบผิดๆ)" },
        { text: "งดคาร์บ 100% กินแต่โปรตีนเพียวๆ", playerEffect: { cred: -10, know: 0 }, athleteEffect: { health: -15, fit: -20, mood: -30, perf: -20 }, feedback: "❌ พังแน่! คาร์บคือตัวพาน้ำและโปรตีนเข้ากล้ามเนื้อ ถ้างดคาร์บ กล้ามเนื้อจะแฟบและไม่มีแรงยก" }
      ],
      trick: [
        { text: "อัดโปรตีนวันละ 5 เท่าของน้ำหนักตัว", playerEffect: { cred: -10, know: 5 }, athleteEffect: { health: -20, fit: 0, mood: -10, perf: -10 }, feedback: "❌ ข้อหลอก! กินโปรตีนล้นเกิน ตับไตทำงานหนัก ร่างกายขับออกเป็นของเสียหมด (รับได้แค่ 1.5-2g/น้ำหนักตัว)" },
        { text: "กินผลไม้รสหวานทดแทนคาร์บทั้งหมด", playerEffect: { cred: -5, know: 5 }, athleteEffect: { health: 5, fit: -10, mood: 10, perf: -5 }, feedback: "❌ ข้อหลอก! ฟรุกโตสในผลไม้เติมไกลโคเจนที่ตับ แต่ไม่ค่อยเข้ากล้ามเนื้อ เพาะกายควรเน้นคาร์บเชิงซ้อน" },
        { text: "ดื่มน้ำผลไม้กล่องแทนน้ำเปล่า", playerEffect: { cred: -10, know: 5 }, athleteEffect: { health: -10, fit: -10, mood: 5, perf: -10 }, feedback: "❌ ข้อหลอก! ดูเหมือนสุขภาพดีแต่น้ำตาลแฝงสูงมาก ทำให้สะสมไขมันบดบังกล้ามเนื้อ" }
      ]
    }
  },
  {
    id: 5,
    name: "ฟ้า (นักวิ่งมาราธอน)",
    avatar: "🏃‍♀️",
    trait: "เครียดง่าย, นอนไม่ค่อยหลับก่อนแข่ง",
    history: "คืนก่อนวันแข่งใหญ่ (Carb-Loading) ควรเตรียมพลังงานอย่างไรดี?",
    secretInfo: "⚠️ ระดับฮอร์โมนเครียดสูง: ระบบย่อยอาหารทำงานช้าลงมาก",
    initialStats: { health: 70, fit: 80, perf: 60, mood: 30 },
    optionsPool: {
      good: [
        { text: "พาสต้าซอสมะเขือเทศ / ข้าวกล้อง", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 30, health: 10, mood: 20, fit: 10 }, feedback: "✅ เพอร์เฟกต์! อาหารย่อยง่ายช่วยสะสมไกลโคเจน ฟ้าหลับสนิท ตื่นมาวิ่งเต็มสูบ" },
        { text: "ข้าวต้มไก่สับ หรือ โจ๊ก", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 25, health: 10, mood: 15, fit: 5 }, feedback: "✅ ดีมาก! เป็นคาร์บที่ผ่านการต้มจนร่วน ย่อยง่ายมาก ไม่รบกวนกระเพาะตอนนอน" },
        { text: "ขนมปังปิ้งทาแยม + น้ำผลไม้สด", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 20, health: 5, mood: 25, fit: 0 }, feedback: "✅ ถูกต้อง! ของหวานทานง่ายช่วยลดความเครียด และให้คาร์บไฮเดรตสะสมได้ดี" }
      ],
      bad: [
        { text: "ชาบูหมูกระทะมันกุ้ง", playerEffect: { cred: -10, know: 0 }, athleteEffect: { perf: -20, health: -10, mood: 30, fit: 0 }, feedback: "❌ พังพินาศ! อาหารมันๆ ย่อยยาก กรดไหลย้อน นอนไม่หลับ วิ่งไม่จบเรซ!" },
        { text: "ส้มตำปูปลาร้าเผ็ดจัด", playerEffect: { cred: -10, know: 0 }, athleteEffect: { perf: -30, health: -20, mood: 10, fit: -10 }, feedback: "❌ หายนะ! ระคายเคืองลำไส้ ฟ้าท้องเสียทั้งคืนก่อนแข่ง หมดแรงข้าวต้ม" },
        { text: "บุฟเฟต์ของทอดจัดเต็ม", playerEffect: { cred: -15, know: 0 }, athleteEffect: { perf: -25, health: -15, mood: 20, fit: -5 }, feedback: "❌ แย่มาก! ไขมันใช้เวลาย่อย 6-8 ชม. กระเพาะทำงานหนักตอนนอน หลับไม่ลึก ฟอร์มตก" }
      ],
      trick: [
        { text: "สเต็กเนื้อวัวริบอาย ชิ้นใหญ่", playerEffect: { cred: -5, know: 5 }, athleteEffect: { perf: -10, health: -5, mood: 10, fit: 5 }, feedback: "❌ ข้อหลอก! เนื้อแดงให้โปรตีนสูง แต่ย่อยยากมากและอยู่ในกระเพาะนาน ทำให้หลับไม่สนิท" },
        { text: "ข้าวขาหมู (เอาเนื้อล้วน)", playerEffect: { cred: -5, know: 5 }, athleteEffect: { perf: -15, health: -10, mood: 15, fit: 0 }, feedback: "❌ ข้อหลอก! ถึงจะเนื้อล้วน แต่น้ำพะโล้มีไขมันแฝงสูงมาก ย่อยยากและจุกเสียด" },
        { text: "ถั่วและธัญพืชรวม 1 ชามใหญ่", playerEffect: { cred: -5, know: 5 }, athleteEffect: { perf: -10, health: 5, mood: -5, fit: 5 }, feedback: "❌ ข้อหลอก! ธัญพืชดี แต่มีกากใย (Fiber) มหาศาล ทำให้เกิดแก๊สในกระเพาะและแน่นท้องตอนเช้า" }
      ]
    }
  }
];

// ฟังก์ชันสุ่มดึงคำตอบ (ถูก 1, ผิด 1, หลอก 1) แล้วสลับตำแหน่ง+ใส่สี
const getRandomOptionsForCase = (optionsPool) => {
  // สุ่มหยิบหมวดละ 1 ข้อ
  const goodChoice = optionsPool.good[Math.floor(Math.random() * optionsPool.good.length)];
  const badChoice = optionsPool.bad[Math.floor(Math.random() * optionsPool.bad.length)];
  const trickChoice = optionsPool.trick[Math.floor(Math.random() * optionsPool.trick.length)];
  
  const selected = [goodChoice, badChoice, trickChoice];

  // สลับตำแหน่ง (Shuffle)
  for (let i = selected.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selected[i], selected[j]] = [selected[j], selected[i]];
  }
  
  // สุ่มชุดสีและจับคู่กับปุ่ม
  const colors = [...buttonColors];
  for (let i = colors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colors[i], colors[j]] = [colors[j], colors[i]];
  }

  return selected.map((opt, index) => ({
    ...opt,
    colorStyle: {
      backgroundColor: colors[index].bg,
      border: `2px solid ${colors[index].border}`
    }
  }));
};

function App() {
  const [screen, setScreen] = useState('home'); 
  const [playerStats, setPlayerStats] = useState({ cred: 50, know: 0 });
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [athleteStats, setAthleteStats] = useState(gameCases[0].initialStats);
  const [step, setStep] = useState('question'); 
  const [feedbackData, setFeedbackData] = useState({ text: '', effects: null });
  const [showScan, setShowScan] = useState(false);
  
  const [currentOptions, setCurrentOptions] = useState([]);

  // โหลดตัวเลือก 3 ข้อตอนเริ่มเกมหรือเปลี่ยนด่าน
  useEffect(() => {
    if (screen === 'playing') {
      setCurrentOptions(getRandomOptionsForCase(gameCases[currentCaseIndex].optionsPool));
    }
  }, [currentCaseIndex, screen]);

  const clamp = (val) => Math.max(0, Math.min(100, val));

  const handleStartGame = () => {
    setScreen('playing');
  };

  const handleOptionSelect = (option) => {
    setPlayerStats(prev => ({
      cred: clamp(prev.cred + option.playerEffect.cred),
      know: prev.know + option.playerEffect.know
    }));

    setAthleteStats(prev => ({
      health: clamp(prev.health + option.athleteEffect.health),
      fit: clamp(prev.fit + option.athleteEffect.fit),
      perf: clamp(prev.perf + option.athleteEffect.perf),
      mood: clamp(prev.mood + option.athleteEffect.mood),
    }));

    setFeedbackData({ text: option.feedback, effects: option.athleteEffect });
    setStep('feedback');
  };

  const handleNextCase = () => {
    if (currentCaseIndex < gameCases.length - 1) {
      const nextIndex = currentCaseIndex + 1;
      setCurrentCaseIndex(nextIndex);
      setAthleteStats(gameCases[nextIndex].initialStats);
      setStep('question');
      setShowScan(false);
    } else {
      setScreen('result');
    }
  };

  const resetGame = () => {
    setPlayerStats({ cred: 50, know: 0 });
    setCurrentCaseIndex(0);
    setAthleteStats(gameCases[0].initialStats);
    setStep('question');
    setShowScan(false);
    setScreen('home');
  };

  const currentCase = gameCases[currentCaseIndex];

  const renderStatBar = (icon, label, value, color) => (
    <div className="stat-row">
      <div className="stat-icon" title={label}>{icon}</div>
      <div className="stat-bar-container">
        <div className="stat-bar-fill" style={{ width: `${value}%`, backgroundColor: color }}></div>
      </div>
      <div style={{ width: '35px', textAlign: 'right' }}>{value}%</div>
    </div>
  );

  const calculateRank = () => {
    const totalScore = playerStats.cred + playerStats.know;
    if (totalScore >= 140) return { rank: "S", title: "ปรมาจารย์โภชนาการทีมชาติ 👑", desc: "ไร้ที่ติ! นักกีฬาทุกคนท็อปฟอร์ม คลินิกของคุณดังระดับโลก" };
    if (totalScore >= 110) return { rank: "A", title: "ผู้เชี่ยวชาญระดับแนวหน้า 🥇", desc: "เก่งมาก! คุณวิเคราะห์เคสได้แม่นยำแทบไม่พลาดเลย" };
    if (totalScore >= 80) return { rank: "B", title: "นักโภชนาการดาวรุ่ง 🌟", desc: "ทำได้ดี แต่ยังมีบางเคสที่โดนข้อหลอกตบตาไปบ้างนะ" };
    if (totalScore >= 50) return { rank: "C", title: "นักโภชนาการฝึกหัด 😅", desc: "พอผ่านเกณฑ์... แต่นักกีฬาบางคนบาดเจ็บเพราะคำแนะนำคุณนะ" };
    return { rank: "F", title: "โดนไล่ออก! 🚨", desc: "นักกีฬาพังพินาศ! คุณต้องกลับไปอ่านหนังสือโภชนาการใหม่ด่วน" };
  };

  return (
    <div className="game-container">
      {screen === 'home' && (
        <div className="home-screen">
          <h1>🏆 Nutri Hero</h1>
          <h2 style={{ color: '#2d3436', marginTop: 0 }}>Sports Dietitian</h2>
          
          <div className="intro-text">
            <p><strong>สวัสดี!</strong> คุณคือนักโภชนาการจบใหม่ที่เพิ่งเข้ามาประจำการในคลินิกการกีฬาทีมชาติ</p>
            <p>วันนี้เป็นวันแรกของคุณ และมีนักกีฬา 5 คนกำลังต่อคิวรอรับคำปรึกษา ทุกคนมีเป้าหมาย นิสัย และข้อจำกัดที่ต่างกัน</p>
            <p><strong>ภารกิจ:</strong> จัดการโภชนาการให้ถูกต้อง อ่านประวัติให้ดี และระวัง <em>"ข้อหลอก"</em> ที่ดูเหมือนจะดีแต่ผิดหลักการ!</p>
            <p style={{ color: '#d63031', fontWeight: 'bold' }}>*ระบบจะประเมิน Rank ของคุณเมื่อจบ 5 เคส!*</p>
          </div>
          
          <button className="btn-start" onClick={handleStartGame}>เริ่มงานวันแรก!</button>
        </div>
      )}

      {screen === 'playing' && (
        <>
          <div className="player-dashboard">
            <div>🌟 Credibility: {playerStats.cred}/100</div>
            <div>🧠 Knowledge: {playerStats.know}/50</div>
          </div>

          <h3 style={{ textAlign: 'center', marginTop: 0, color: '#2d3436' }}>เคสที่ {currentCaseIndex + 1} / {gameCases.length}</h3>
          
          <div className="athlete-profile">
            <div className="avatar-section">
              <div className="avatar">{currentCase.avatar}</div>
              <div className="athlete-name">{currentCase.name}</div>
            </div>
            
            <div className="stats-section">
              {renderStatBar("❤️", "Health", athleteStats.health, "#ff7675")}
              {renderStatBar("💪", "Fitness", athleteStats.fit, "#55efc4")}
              {renderStatBar("⚡", "Performance", athleteStats.perf, "#74b9ff")}
              {renderStatBar("😊", "Mood", athleteStats.mood, "#fdcb6e")}
            </div>
          </div>

          <div className="story-box">
            <div className="trait">📌 นิสัย: {currentCase.trait}</div>
            <p style={{ margin: 0, fontSize: '15px', color: '#2d3436', lineHeight: 1.5 }}>
              {step === 'question' ? currentCase.history : (
                <span style={{ color: feedbackData.text.includes('❌') ? '#d63031' : '#00b894', fontWeight: 'bold' }}>
                  {feedbackData.text}
                </span>
              )}
            </p>
            
            {step === 'question' && (
              <div>
                {!showScan ? (
                  <button className="btn-scan" onClick={() => setShowScan(true)}>
                    🔍 ซักประวัติ/สแกนข้อมูลเชิงลึก
                  </button>
                ) : (
                  <div className="scan-result">
                    <strong>🔬 ข้อมูลทางคลินิก:</strong> {currentCase.secretInfo}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="options-container">
            {step === 'question' ? (
              currentOptions.map((option, index) => (
                <button 
                  key={index}
                  className="btn-option" 
                  style={option.colorStyle}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option.text}
                </button>
              ))
            ) : (
              <button className="btn-next" onClick={handleNextCase}>
                {currentCaseIndex < gameCases.length - 1 ? '➡ ไปรับเคสต่อไป' : '🏆 ดูสรุปผลงาน'}
              </button>
            )}
          </div>
        </>
      )}

      {screen === 'result' && (() => {
        const resultInfo = calculateRank();
        return (
          <div className="result-screen">
            <h1>สรุปผลการประเมิน</h1>
            
            <div className="rank-box">
              <h3 style={{ margin: 0, color: '#2d3436' }}>Rank ของคุณคือ</h3>
              <div className="rank-score">{resultInfo.rank}</div>
              <h2 style={{ color: '#0984e3', margin: '5px 0' }}>{resultInfo.title}</h2>
              <p style={{ fontSize: '14px', color: '#636e72', margin: '10px 0' }}>{resultInfo.desc}</p>
            </div>

            <div style={{ textAlign: 'left', backgroundColor: 'white', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
              <p style={{ margin: '5px 0' }}>🌟 ความน่าเชื่อถือ (Credibility): <strong>{playerStats.cred} / 100</strong></p>
              <p style={{ margin: '5px 0' }}>🧠 ความรู้สะสม (Knowledge): <strong>{playerStats.know} / 50</strong></p>
            </div>

            <div className="qr-section">
              <p>🎯 ท้าเพื่อนมาลองเป็นนักโภชนาการ!</p>
              <img 
                className="qr-image" 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://nutritionist-sim.vercel.app" 
                alt="QR Code" 
              />
              <p className="qr-hint">สแกน QR Code เพื่อเล่นเกมนี้</p>
            </div>

            <button className="btn-reset" onClick={resetGame}>🔄 เปิดคลินิกรอบใหม่</button>
          </div>
        )
      })()}
    </div>
  );
}

export default App;