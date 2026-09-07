import { useState } from 'react';
import './App.css';

const gameCases = [
  {
    id: 1,
    name: "ต้น (นักฟุตบอล)",
    avatar: "⚽",
    trait: "ใจร้อน, แอบกินของทอดประจำ",
    history: "อีก 2 ชม. จะลงแข่งสนามใหญ่ รู้อยู่แล้วว่าชอบกินของทอด แต่ต้องการพลังงานด่วนโดยไม่จุก",
    secretInfo: "⚠️ กรดในกระเพาะอาหารสูง: หากกินของทอดหรือไขมันสูงตอนนี้ มีความเสี่ยงสูงมากที่จะเกิดภาวะกรดไหลย้อนขณะวิ่ง",
    initialStats: { health: 70, fit: 80, perf: 50, mood: 40 }, 
    options: [
      { text: "จัดมื้อ 'ข้าวขาว + กล้วยหอม'", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 20, fit: 5, mood: -10, health: 0 }, feedback: "ต้นบ่นนิดหน่อย แต่คาร์บเชิงซ้อนและกล้วยช่วยให้พลังงานทันที ไม่จุก" },
      { text: "ยอมตามใจจัด 'ไก่ทอด + น้ำอัดลม'", type: "B", playerEffect: { cred: -10, know: 0 }, athleteEffect: { perf: -20, fit: 0, mood: 30, health: -10 }, feedback: "ต้นฟินมาก แต่ไขมันทอดทำให้กรดไหลย้อนกำเริบ วิ่งไม่ออก โค้ชด่ายับ!" }
    ]
  },
  {
    id: 2,
    name: "เมย์ (นักแบดมินตัน)",
    avatar: "🏸",
    trait: "วิตกกังวลสูง, แพ้นมวัว",
    history: "แข่งเสร็จมื้อเย็น ร่างกายล้ามาก ต้องการอาหารซ่อมแซมกล้ามเนื้อภายใน 30 นาที",
    secretInfo: "⚠️ ตรวจพบภูมิไวรับ (Intolerance): ร่างกายไม่มีเอนไซม์ย่อยแลคโตสในนมวัว หากฝืนกินจะท้องเสียเฉียบพลัน",
    initialStats: { health: 40, fit: 50, perf: 50, mood: 30 },
    options: [
      { text: "แนะนำ 'อกไก่ + ข้าวสวย + น้ำมะพร้าว'", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { health: 30, fit: 20, mood: 20, perf: 10 }, feedback: "เมย์ฟื้นตัวได้ดีมาก น้ำมะพร้าวช่วยคืนเกลือแร่ ร่างกายพร้อมสู้ต่อ" },
      { text: "แนะนำ 'เวย์โปรตีนผสมนมวัว'", type: "B", playerEffect: { cred: -15, know: 0 }, athleteEffect: { health: -30, perf: -20, mood: -20, fit: -10 }, feedback: "เมย์แพ้นมวัวอย่างหนัก! ท้องเสียจนร่างกายทรุด แข่งต่อพรุ่งนี้ไม่ได้" }
    ]
  },
  {
    id: 3,
    name: "บาส (นักบาสเกตบอล)",
    avatar: "🏀",
    trait: "เป็นตะคริวบ่อยช่วงครึ่งหลัง",
    history: "แข่งกลางแจ้ง เสียเหงื่อเยอะมาก มาปรึกษาเรื่องการเติมน้ำและเกลือแร่",
    secretInfo: "⚠️ ภาวะโซเดียมต่ำ (Hyponatremia): เสียเหงื่อเยอะมาก การดื่มแค่น้ำเปล่ารวดเดียวจะทำให้เกลือแร่เจือจางจนช็อกได้",
    initialStats: { health: 60, fit: 70, perf: 40, mood: 50 },
    options: [
      { text: "ดื่ม 'น้ำเกลือแร่สำหรับนักกีฬา + กล้วยหอม'", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 30, health: 15, fit: 10, mood: 10 }, feedback: "ได้โซเดียมและโพแทสเซียมคืน บาสวิ่งปร๋อจบเกมไม่มีตะคริว" },
      { text: "ดื่ม 'น้ำเปล่าเย็นจัดปริมาณมากๆ ทีเดียว'", type: "B", playerEffect: { cred: -5, know: 0 }, athleteEffect: { perf: -15, health: -15, fit: 0, mood: -10 }, feedback: "เกลือแร่เจือจางฉับพลัน บาสจุกและตะคริวกินหนักกว่าเดิม" }
    ]
  },
  {
    id: 4,
    name: "กาย (นักเพาะกาย)",
    avatar: "🏋️",
    trait: "มีวินัยสูงมาก, ซีเรียสเรื่องมวลกล้ามเนื้อ",
    history: "ต้องการฟื้นฟูกล้ามเนื้อและสร้างความแข็งแรงระยะยาว",
    secretInfo: "⚠️ การอักเสบระดับไมโคร (Micro-tears): ต้องการทั้งโปรตีนและวิตามิน/แร่ธาตุธรรมชาติจากอาหารหลักเพื่อซ่อมแซม อาหารเสริมเดี่ยวๆ ไม่พอ",
    initialStats: { health: 80, fit: 90, perf: 70, mood: 70 },
    options: [
      { text: "โปรตีนคุณภาพดี (ไข่ต้ม, อกไก่) สลับตามมื้อ", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { fit: 10, health: 10, mood: 10, perf: 10 }, feedback: "โภชนาการสมบูรณ์ กล้ามเนื้อฟื้นฟูและใหญ่ขึ้นอย่างเห็นได้ชัด!" },
      { text: "กิน 'อาหารเสริมสังเคราะห์เข้มข้น งดมื้อหลัก'", type: "B", playerEffect: { cred: -10, know: 0 }, athleteEffect: { health: -30, fit: -10, mood: -20, perf: -10 }, feedback: "ขาดวิตามินแร่ธาตุหลัก (Micronutrients) ร่างกายเครียดและโทรมลง" }
    ]
  },
  {
    id: 5,
    name: "ฟ้า (นักวิ่งมาราธอน)",
    avatar: "🏃‍♀️",
    trait: "เครียดง่าย, นอนไม่ค่อยหลับก่อนแข่ง",
    history: "คืนก่อนวันแข่งใหญ่ (Carb-Loading) ควรเตรียมพลังงานอย่างไรดี?",
    secretInfo: "⚠️ ระดับฮอร์โมนเครียด (Cortisol) สูง: ระบบย่อยอาหารทำงานช้าลงมาก หากกินของมันๆ จะย่อยไม่ทันและเกิดการหมักหมม",
    initialStats: { health: 70, fit: 80, perf: 60, mood: 30 },
    options: [
      { text: "พาสต้าซอสมะเขือเทศ (ย่อยง่าย)", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 30, health: 10, mood: 20, fit: 10 }, feedback: "อาหารย่อยง่าย ฟ้าหลับสบาย ตื่นมาพร้อมพลังงาน Carb-load สมบูรณ์" },
      { text: "ชาบูหมูกระทะมันกุ้ง (เพื่อความฟิน)", type: "B", playerEffect: { cred: -10, know: 0 }, athleteEffect: { perf: -20, health: -10, mood: 30, fit: 0 }, feedback: "กินเพลินแต่อาหารไม่ย่อย กรดไหลย้อน นอนไม่หลับ วิ่งไม่จบเรซ!" }
    ]
  }
];

function App() {
  const [playerStats, setPlayerStats] = useState({ cred: 50, know: 0 });
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [athleteStats, setAthleteStats] = useState(gameCases[0].initialStats);
  const [step, setStep] = useState('question'); 
  const [feedbackData, setFeedbackData] = useState({ text: '', effects: null });
  
  // State ใหม่ สำหรับควบคุมปุ่ม "สแกนร่างกาย"
  const [showScan, setShowScan] = useState(false);

  const clamp = (val) => Math.max(0, Math.min(100, val));

  const handleOptionSelect = (option) => {
    setPlayerStats(prev => ({
      cred: prev.cred + option.playerEffect.cred,
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
      
      // รีเซ็ตการสแกนทุกครั้งที่เปลี่ยนคน
      setShowScan(false);
    } else {
      setStep('result');
    }
  };

  const resetGame = () => {
    setPlayerStats({ cred: 50, know: 0 });
    setCurrentCaseIndex(0);
    setAthleteStats(gameCases[0].initialStats);
    setStep('question');
    setShowScan(false);
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

  return (
    <div className="game-container">
      <div className="player-dashboard">
        <div>🌟 Credibility: {playerStats.cred}</div>
        <div>🧠 Knowledge: {playerStats.know}</div>
      </div>

      {step !== 'result' ? (
        <>
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
            <p style={{ margin: 0, fontSize: '15px', color: '#2d3436' }}>
              {step === 'question' ? currentCase.history : (
                <span style={{ color: '#0984e3', fontWeight: 'bold' }}>ผลลัพธ์: {feedbackData.text}</span>
              )}
            </p>
            
            {/* โค้ดส่วนปุ่มสแกนร่างกายที่เพิ่มเข้ามา */}
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
              <>
                <button className="btn-option" onClick={() => handleOptionSelect(currentCase.options[0])}>
                  A: {currentCase.options[0].text}
                </button>
                <button className="btn-option alt" onClick={() => handleOptionSelect(currentCase.options[1])}>
                  B: {currentCase.options[1].text}
                </button>
              </>
            ) : (
              <button className="btn-option" style={{ backgroundColor: '#00b894', borderColor: '#00a8ff' }} onClick={handleNextCase}>
                {currentCaseIndex < gameCases.length - 1 ? '➡ ไปรับเคสต่อไป' : '🏆 ดูสรุปผลงาน'}
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="result-screen">
          <h1>สรุปผลงาน</h1>
          {playerStats.cred >= 70 && playerStats.know >= 40 ? (
            <div>
              <h2>🎉 ยินดีด้วย! 🎉</h2>
              <p>คุณได้รับแต่งตั้งเป็น <strong>'หัวหน้านักโภชนาการการกีฬาประจำทีมชาติ'! 🏆</strong></p>
            </div>
          ) : (
            <div>
              <h2>😅 ยังต้องพยายามอีกนิด 😅</h2>
              <p>ความน่าเชื่อถือยังไม่พอ นักกีฬาบางคนบาดเจ็บและฟอร์มตก ต้องศึกษาเพิ่มเติมนะ</p>
            </div>
          )}
          <button className="btn-reset" onClick={resetGame}>เปิดคลินิกรับเคสใหม่</button>
        </div>
      )}
    </div>
  );
}

export default App;