import { useState, useEffect } from 'react';
import './App.css';

// ชุดสีพาสเทลสำหรับสุ่มปุ่มตัวเลือก
const buttonColors = [
  { bg: '#a29bfe', border: '#6c5ce7' }, // ม่วง
  { bg: '#fab1a0', border: '#e17055' }, // ส้ม
  { bg: '#81ecec', border: '#00cec9' }, // ฟ้า
  { bg: '#55efc4', border: '#00b894' }, // เขียว
  { bg: '#ffeaa7', border: '#fdcb6e' }, // เหลือง
  { bg: '#ff7675', border: '#d63031' }  // แดง
];

// ข้อมูล 5 เคสเหมือนเดิม
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
      { text: "จัดมื้อ 'ข้าวขาว + กล้วยหอม'", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 20, fit: 5, mood: -10, health: 0 }, feedback: "✅ ถูกต้อง! ต้นวิ่งฉิวไม่จุก (ความรู้: ก่อนแข่ง 1-2 ชม. ควรเน้นคาร์บไฮเดรตที่ย่อยง่าย กากใยและไขมันต่ำ เพื่อให้ร่างกายดึงไปใช้เป็นพลังงานได้ทันทีโดยไม่เป็นภาระกระเพาะ)" },
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
      { text: "แนะนำ 'อกไก่ + ข้าวสวย + น้ำมะพร้าว'", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { health: 30, fit: 20, mood: 20, perf: 10 }, feedback: "✅ เป๊ะมาก! เมย์ฟื้นตัวได้ดี (ความรู้: น้ำมะพร้าวช่วยชดเชยเกลือแร่ธรรมชาติ ส่วนอกไก่และข้าวสวยให้โปรตีน-คาร์บเพื่อซ่อมแซมกล้ามเนื้อโดยไม่มีแลคโตสมากวนลำไส้)" },
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
      { text: "ดื่ม 'น้ำเกลือแร่สำหรับนักกีฬา + กล้วยหอม'", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 30, health: 15, fit: 10, mood: 10 }, feedback: "✅ ถูกต้อง! (ความรู้: การเสียเหงื่อมากต้องชดเชยด้วยของเหลวที่มีโซเดียม และกล้วยมีโพแทสเซียมสูง ช่วยรักษาสมดุลและป้องกันกล้ามเนื้อหดเกร็งหรือตะคริว)" },
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
      { text: "โปรตีนคุณภาพดี (ไข่ต้ม, อกไก่, ปลา) สลับตามมื้อ", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { fit: 10, health: 10, mood: 10, perf: 10 }, feedback: "✅ ยอดเยี่ยม! (ความรู้: ร่างกายต้องการอาหารหลัก (Whole Foods) ที่มีสารอาหารรอง ไมโครนิวเทรียนต์ เพื่อกระบวนการสังเคราะห์โปรตีนและฟื้นฟูกล้ามเนื้อที่สมบูรณ์ ไม่ใช่แค่โปรตีนสกัด)" },
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
      { text: "พาสต้าซอสมะเขือเทศ / ข้าวกล้อง", type: "A", playerEffect: { cred: 10, know: 10 }, athleteEffect: { perf: 30, health: 10, mood: 20, fit: 10 }, feedback: "✅ เพอร์เฟกต์! (ความรู้: มื้อ Carb-loading ก่อนแข่งควรเน้นคาร์บเชิงซ้อนที่ไขมันต่ำ เพื่อให้ร่างกายสะสมไกลโคเจนได้เต็มที่ อาหารย่อยง่ายช่วยให้หลับสนิท ไม่กวนกระเพาะ)" },
      { text: "ชาบูหมูกระทะมันกุ้ง", type: "B", playerEffect: { cred: -10, know: 0 }, athleteEffect: { perf: -20, health: -10, mood: 30, fit: 0 }, feedback: "❌ พังพินาศ! อาหารไม่ย่อย กรดไหลย้อน นอนไม่หลับ วิ่งไม่จบเรซ!" },
      { text: "สเต็กเนื้อวัวริบอาย ชิ้นใหญ่", type: "C", playerEffect: { cred: -5, know: 5 }, athleteEffect: { perf: -10, health: -5, mood: 10, fit: 5 }, feedback: "❌ ข้อหลอก! เนื้อแดงให้โปรตีนสูง แต่ย่อยยากมากและใช้เวลาอยู่ในกระเพาะนาน (ความรู้: คืนก่อนแข่งควรเน้นคาร์บย่อยง่าย ลดเนื้อสัตว์ย่อยยาก เพื่อให้หลับสบาย)" }
    ]
  }
];

// ฟังก์ชันสุ่มทั้งข้อความและดึงสีมาใส่ให้ปุ่ม
const shuffleArrayWithColors = (array) => {
  const shuffledOptions = [...array];
  // 1. สุ่มคำตอบก่อน
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
  }
  
  // 2. สุ่มลำดับสีจากชุดสีที่เราเตรียมไว้
  const shuffledColors = [...buttonColors];
  for (let i = shuffledColors.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledColors[i], shuffledColors[j]] = [shuffledColors[j], shuffledColors[i]];
  }

  // 3. จับคู่สีกับคำตอบที่สุ่มแล้ว
  return shuffledOptions.map((opt, index) => ({
    ...opt,
    colorStyle: {
      backgroundColor: shuffledColors[index].bg,
      border: `2px solid ${shuffledColors[index].border}`
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

  useEffect(() => {
    if (screen === 'playing') {
      setCurrentOptions(shuffleArrayWithColors(gameCases[currentCaseIndex].options));
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
            <p style={{ color: '#d63031', fontWeight: 'bold' }}>*ระบบประเมินผลจะจัด Rank ของคุณเมื่อจบ 5 เคส!*</p>
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
              currentOptions.map((option, index) => (
                <button 
                  key={index}
                  className="btn-option" 
                  style={option.colorStyle} // ดึงสีที่สุ่มไว้มาใช้ตรงนี้
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

            <div style={{ textAlign: 'left', backgroundColor: 'white', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
              <p style={{ margin: '5px 0' }}>🌟 ความน่าเชื่อถือ (Credibility): <strong>{playerStats.cred} / 100</strong></p>
              <p style={{ margin: '5px 0' }}>🧠 ความรู้สะสม (Knowledge): <strong>{playerStats.know} / 50</strong></p>
            </div>
            {/* เพิ่มส่วน QR Code ตรงนี้ครับ */}
            <div className="qr-section">
              <p>🎯 ท้าเพื่อนมาลองเป็นนักโภชนาการ!</p>
              {/* เปลี่ยน YOUR_VERCEL_LINK ตรง data=... ให้เป็นลิงก์เว็บจริงของคุณ */}
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