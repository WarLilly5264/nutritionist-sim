import { useState } from 'react';
import './App.css';

const gameCases = [
  {
    id: 1,
    name: "ต้น (นักฟุตบอล)",
    avatar: "⚽",
    trait: "ใจร้อน, แอบกินของทอดประจำ",
    history: "อีก 2 ชม. จะลงแข่งสนามใหญ่ รู้อยู่แล้วว่าชอบกินของทอด แต่ต้องการพลังงานด่วนโดยไม่จุก",
    secretInfo: "⚠️ กรดในกระเพาะอาหารสูง: ควรงดไขมันและไฟเบอร์สูง เพราะใช้เวลาย่อยนาน",
    initialStats: { health: 70, fit: 80, perf: 50, mood: 40 }, 
    options: [
      { text: "จัดมื้อ 'ข้าวขาว + กล้วยหอม'", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 20, fit: 5, mood: -10, health: 0 }, feedback: "✅ ถูกต้อง! คาร์บเชิงซ้อนย่อยง่ายและกล้วยช่วยให้พลังงานทันที ต้นวิ่งฉิวไม่จุก" },
      { text: "ยอมตามใจจัด 'ไก่ทอด + น้ำอัดลม'", type: "B", playerEffect: { cred: -10, know: 0 }, athleteEffect: { perf: -20, fit: 0, mood: 30, health: -10 }, feedback: "❌ ผิดเต็มๆ! ไขมันทอดทำให้กรดไหลย้อน ต้นวิ่งไม่ออก โค้ชด่ายับ!" },
      { text: "สลัดผักรวมชามโต + อกไก่", type: "C", playerEffect: { cred: -5, know: 5 }, athleteEffect: { perf: -15, fit: 5, mood: -10, health: 10 }, feedback: "❌ ข้อหลอก! สลัดผักดูสุขภาพดี แต่ไฟเบอร์สูงมากใช้เวลาย่อยนาน ต้นจุกเสียดก่อนแข่ง (ความรู้: 1-2 ชม. ก่อนแข่ง ควรงดไฟเบอร์สูง)" }
    ]
  },
  {
    id: 2,
    name: "เมย์ (นักแบดมินตัน)",
    avatar: "🏸",
    trait: "วิตกกังวลสูง, แพ้นมวัว",
    history: "แข่งเสร็จมื้อเย็น ร่างกายล้ามาก ต้องการอาหารซ่อมแซมกล้ามเนื้อภายใน 30 นาที",
    secretInfo: "⚠️ ตรวจพบภูมิไวรับ: ร่างกายไม่มีเอนไซม์ย่อยแลคโตสในนมวัว",
    initialStats: { health: 40, fit: 50, perf: 50, mood: 30 },
    options: [
      { text: "แนะนำ 'อกไก่ + ข้าวสวย + น้ำมะพร้าว'", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { health: 30, fit: 20, mood: 20, perf: 10 }, feedback: "✅ เป๊ะมาก! เมย์ฟื้นตัวได้ดี น้ำมะพร้าวช่วยคืนเกลือแร่ ร่างกายพร้อมสู้ต่อ" },
      { text: "แนะนำ 'เวย์โปรตีนผสมนมวัว'", type: "B", playerEffect: { cred: -15, know: 0 }, athleteEffect: { health: -30, perf: -20, mood: -20, fit: -10 }, feedback: "❌ พลาดแรง! เมย์แพ้นมวัว ท้องเสียหนักจนร่างกายทรุด" },
      { text: "ผลไม้ตระกูลเบอร์รี่ + นมอัลมอนด์", type: "C", playerEffect: { cred: 0, know: 5 }, athleteEffect: { health: 10, perf: -10, mood: 10, fit: -5 }, feedback: "❌ ข้อหลอก! วิตามินดี แต่คาร์บและโปรตีนไม่พอซ่อมแซมกล้ามเนื้อที่ฉีกขาด (ความรู้: หลังแข่งหนัก 30 นาทีแรก ร่างกายต้องการโปรตีนและคาร์บที่ดูดซึมไว)" }
    ]
  },
  {
    id: 3,
    name: "บาส (นักบาสเกตบอล)",
    avatar: "🏀",
    trait: "เป็นตะคริวบ่อยช่วงครึ่งหลัง",
    history: "แข่งกลางแจ้ง เสียเหงื่อเยอะมาก มาปรึกษาเรื่องการเติมน้ำและเกลือแร่",
    secretInfo: "⚠️ ภาวะโซเดียมต่ำ: ดื่มแค่น้ำเปล่ารวดเดียวจะทำให้เกลือแร่เจือจาง",
    initialStats: { health: 60, fit: 70, perf: 40, mood: 50 },
    options: [
      { text: "ดื่ม 'น้ำเกลือแร่สำหรับนักกีฬา + กล้วยหอม'", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 30, health: 15, fit: 10, mood: 10 }, feedback: "✅ ถูกต้อง! โซเดียมและโพแทสเซียมคืนสมดุล บาสวิ่งปร๋อไม่มีตะคริว" },
      { text: "ดื่ม 'น้ำเปล่าเย็นจัด 1 ลิตร ทีเดียว'", type: "B", playerEffect: { cred: -10, know: 0 }, athleteEffect: { perf: -15, health: -15, fit: 0, mood: -10 }, feedback: "❌ อันตราย! เกลือแร่เจือจางฉับพลัน บาสจุกและตะคริวกินหนักกว่าเดิม" },
      { text: "ดื่ม 'น้ำอัดลมเกลือแร่ (สูตรซ่า)'", type: "C", playerEffect: { cred: -5, know: 5 }, athleteEffect: { perf: -10, health: -5, fit: 0, mood: 20 }, feedback: "❌ ข้อหลอก! มีเกลือแร่ก็จริง แต่แก๊สในน้ำอัดลมทำให้เกิดอาการจุกเสียดแน่นท้องระหว่างวิ่ง (ความรู้: นักกีฬาควรเลี่ยงเครื่องดื่มอัดแก๊สระหว่างแข่ง)" }
    ]
  },
  {
    id: 4,
    name: "กาย (นักเพาะกาย)",
    avatar: "🏋️",
    trait: "มีวินัยสูงมาก, ซีเรียสเรื่องมวลกล้ามเนื้อ",
    history: "ต้องการฟื้นฟูกล้ามเนื้อและสร้างความแข็งแรงระยะยาว",
    secretInfo: "⚠️ การอักเสบระดับไมโคร: ต้องการวิตามิน/แร่ธาตุธรรมชาติร่วมด้วย",
    initialStats: { health: 80, fit: 90, perf: 70, mood: 70 },
    options: [
      { text: "โปรตีนคุณภาพดี (ไข่ต้ม, อกไก่, ปลา) สลับตามมื้อ", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { fit: 10, health: 10, mood: 10, perf: 10 }, feedback: "✅ ยอดเยี่ยม! ได้ทั้งโปรตีนและ Micronutrients กล้ามเนื้อฟื้นฟูดีมาก" },
      { text: "กิน 'อาหารเสริมสังเคราะห์ งดมื้อหลัก'", type: "B", playerEffect: { cred: -10, know: 0 }, athleteEffect: { health: -30, fit: -10, mood: -20, perf: -10 }, feedback: "❌ ผิดหลัก! ขาดวิตามินแร่ธาตุหลัก ร่างกายเครียดและโทรมลง" },
      { text: "อัดโปรตีนวันละ 5 เท่าของน้ำหนักตัว", type: "C", playerEffect: { cred: -10, know: 5 }, athleteEffect: { health: -20, fit: 0, mood: -10, perf: -10 }, feedback: "❌ ข้อหลอก! กินโปรตีนเยอะเกินไป ตับและไตทำงานหนัก ร่างกายขับออกเป็นของเสียหมด (ความรู้: ร่างกายดูดซึมโปรตีนต่อมื้อได้จำกัด แค่ 1.5-2 กรัมต่อน้ำหนักตัวก็พอแล้ว)" }
    ]
  },
  {
    id: 5,
    name: "ฟ้า (นักวิ่งมาราธอน)",
    avatar: "🏃‍♀️",
    trait: "เครียดง่าย, นอนไม่ค่อยหลับก่อนแข่ง",
    history: "คืนก่อนวันแข่งใหญ่ (Carb-Loading) ควรเตรียมพลังงานอย่างไรดี?",
    secretInfo: "⚠️ ระดับฮอร์โมนเครียดสูง: ระบบย่อยอาหารทำงานช้าลงมาก",
    initialStats: { health: 70, fit: 80, perf: 60, mood: 30 },
    options: [
      { text: "พาสต้าซอสมะเขือเทศ / ข้าวกล้อง", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 30, health: 10, mood: 20, fit: 10 }, feedback: "✅ เพอร์เฟกต์! อาหารย่อยง่าย ฟ้าหลับสบาย ตื่นมาวิ่งเต็มสูบ" },
      { text: "ชาบูหมูกระทะมันกุ้ง", type: "B", playerEffect: { cred: -10, know: 0 }, athleteEffect: { perf: -20, health: -10, mood: 30, fit: 0 }, feedback: "❌ พังพินาศ! อาหารไม่ย่อย กรดไหลย้อน นอนไม่หลับ วิ่งไม่จบเรซ!" },
      { text: "สเต็กเนื้อวัวริบอาย ชิ้นใหญ่", type: "C", playerEffect: { cred: -5, know: 5 }, athleteEffect: { perf: -10, health: -5, mood: 10, fit: 5 }, feedback: "❌ ข้อหลอก! เนื้อแดงให้โปรตีนสูง แต่ย่อยยากมากและใช้เวลาอยู่ในกระเพาะนาน (ความรู้: คืนก่อนแข่งควรเน้นคาร์บย่อยง่าย ลดเนื้อสัตว์ย่อยยาก เพื่อให้หลับสบาย)" }
    ]
  }
];

function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'playing' | 'result'
  const [playerStats, setPlayerStats] = useState({ cred: 50, know: 0 });
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [athleteStats, setAthleteStats] = useState(gameCases[0].initialStats);
  const [step, setStep] = useState('question'); 
  const [feedbackData, setFeedbackData] = useState({ text: '', effects: null });
  const [showScan, setShowScan] = useState(false);

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
            <p style={{ color: '#d63031', fontWeight: 'bold' }}>*โภชนาการที่ผิดพลาด อาจทำให้อนาคตของพวกเขาพังทลาย!*</p>
          </div>
          
          <button className="btn-start" onClick={handleStartGame}>เริ่มงานวันแรก!</button>
        </div>
      )}

      {screen === 'playing' && (
        <>
          <div className="player-dashboard">
            <div>🌟 Credibility: {playerStats.cred}</div>
            <div>🧠 Knowledge: {playerStats.know}</div>
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
            <p style={{ margin: 0, fontSize: '15px', color: '#2d3436' }}>
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
              <>
                <button className="btn-option" onClick={() => handleOptionSelect(currentCase.options[0])}>
                  A: {currentCase.options[0].text}
                </button>
                <button className="btn-option alt" style={{ backgroundColor: '#fab1a0', borderColor: '#e17055' }} onClick={() => handleOptionSelect(currentCase.options[1])}>
                  B: {currentCase.options[1].text}
                </button>
                <button className="btn-option" style={{ backgroundColor: '#ffeaa7', color: '#2d3436', borderColor: '#fdcb6e' }} onClick={() => handleOptionSelect(currentCase.options[2])}>
                  C: {currentCase.options[2].text}
                </button>
              </>
            ) : (
              <button className="btn-option" style={{ backgroundColor: '#00b894', borderColor: '#00a8ff' }} onClick={handleNextCase}>
                {currentCaseIndex < gameCases.length - 1 ? '➡ ไปรับเคสต่อไป' : '🏆 ดูสรุปผลงาน'}
              </button>
            )}
          </div>
        </>
      )}

      {screen === 'result' && (
        <div className="result-screen">
          <h1>สรุปผลงาน</h1>
          {playerStats.cred >= 70 && playerStats.know >= 30 ? (
            <div>
              <h2>🎉 ยินดีด้วย! 🎉</h2>
              <p>คุณได้รับแต่งตั้งเป็น <strong>'หัวหน้านักโภชนาการการกีฬาประจำทีมชาติ'! 🏆</strong></p>
            </div>
          ) : (
            <div>
              <h2>😅 ยังต้องพยายามอีกนิด 😅</h2>
              <p>คุณอาจจะโดนข้อหลอกไปหลายข้อแน่ๆ! ความน่าเชื่อถือยังไม่พอ นักกีฬาบาดเจ็บและฟอร์มตก ต้องศึกษาเพิ่มเติมนะ</p>
            </div>
          )}
          <button className="btn-reset" onClick={resetGame}>เปิดคลินิกรับเคสใหม่</button>
        </div>
      )}
    </div>
  );
}

export default App;