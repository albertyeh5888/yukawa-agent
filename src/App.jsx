import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import html2canvas from 'html2canvas';
import './App.css';

// 匯入素材
import yukawaPortrait from './assets/yukawa-portrait.png';
import frameGuide from './assets/frame.png'; 

const questions = [
  {
    id: 1,
    title: "展品一：面對混沌不明的難題",
    description: "如果你面對一個混沌不明的難題時，你更傾向於哪種探索方式？",
    options: [
      { text: "類型A(實務派)：徹底收集數據，推導邏輯", score: 0.5 },
      { text: "類型B(理想派/湯川型)：想像應存在的未知，再用數學證明", score: 1.0 }
    ]
  },
  {
    id: 2,
    title: "展品二：深夜 23:30 的忙碌身影",
    description: "當你站在天橋上，看著下方深夜中無數的車燈流過時，你的第一直覺是？",
    options: [
      { text: "類型A：感到規律美感，社會充滿活力", score: 0.3 },
      { text: "類型B(湯川型)：感到空虛，終點到底是什麼？", score: 1.0 },
      { text: "類型C：每盞燈下都有個為夢想苦惱的靈魂", score: 0.7 }
    ]
  },
  {
    id: 3,
    title: "展品三：當努力變得沒有回音時",
    description: "在令人灰心的情況下，你心中浮現的想法是？",
    options: [
      { text: "類型A(結果導向)：找不到成果就換條路試試", score: 0.4 },
      { text: "類型B(湯川型)：每天堅持比昨天多做一點就有進展", score: 1.0 }
    ]
  },
  {
    id: 4,
    title: "展品四：面對分裂時代的直覺",
    description: "1949 年，湯川秀樹因為發現了將原子核緊緊綁在一起的「核力」而獲得諾貝爾獎。但諷刺的是，這項集結了人類最高智慧的發現，在當時卻被大國用來製造原子彈，把世界推向了冷戰與互相毀滅的邊緣。",
    description:"",
    description:"當你發現自己引以為傲的專業能力（不論是科學、商學或技術），被這個充满對立的社會利用時，你的第一直覺是？",
    options: [
      { text: "類型A「把自己能掌控的專業做到極致，就是最大的貢獻。」（對應類型：理性實踐者 —— 選擇回到實驗室與課堂。你認為社會如何利用它是社會的事，專注於自己的專業、培養下一代優秀的人才，才是最踏實且安全的做法。）", score: 0.6 },
      { text: "類型B「如果社會走向毀滅，我的專業做得再好也毫無意義。」（對應類型：湯川型／觀察者 —— 選擇走出舒適圈。你決定燃燒自己的名聲與時間，哪怕被嘲笑「不切實際」，也要站到第一線去推動「世界是一體的」這種和平理想，試圖改變社會的現狀。）", score: 1.0 }
    ]
  }
];

function App() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1); // -1: 拍照, 0-3: 題目, 4: 掃描中, 5: 結果
  const [totalScore, setTotalScore] = useState(0);

  // 模擬掃描過渡效果
  useEffect(() => {
    if (currentStep === 4) {
      const timer = setTimeout(() => {
        setCurrentStep(5);
      }, 3000); // 掃描動畫持續 3 秒
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const videoConstraints = {
    width: 1280,
    height: 960,
    facingMode: "user"
  };

  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
      setCurrentStep(0);
    }
  };

  const handleAnswer = (score) => {
    setTotalScore(prev => prev + score);
    setCurrentStep(prev => prev + 1);
  };

  const downloadImage = async () => {
    const element = document.getElementById('photo-area');
    if (!element) return;
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2
    });
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'yukawa-agent-id.png';
    link.click();
  };

  const similarity = ((totalScore / questions.length) * 100).toFixed(0);
  const isSuccess = similarity >= 75; // 設定 75% 為成功門檻

  return (
    <div className="app-container">
      <h1>時空探員：思維同步計畫</h1>

      {/* --- 步驟 -1：拍照獲取身分 --- */}
      {currentStep === -1 && (
        <div className="camera-section">
          <p className="instruction">【探員登錄】請對準引導框以獲取初始波長...</p>
          <div className="webcam-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam-view"
              videoConstraints={videoConstraints}
              mirrored={true} /* 加上這一行，讓即時預覽直接鏡像 */
            />
            <img src={frameGuide} alt="Guide frame" className="camera-guide-overlay" />
            <div className="scanner-line"></div>
          </div>
          <button onClick={capture} className="btn-main">啟動掃描辨識</button>
        </div>
      )}

      {/* --- 步驟 0~3：問答階段 --- */}
      {currentStep >= 0 && currentStep < questions.length && (
        <div className="question-section">
          <div className="progress-bar">
            探員思維同步中：{currentStep + 1} / {questions.length}
          </div>
          <h2 className="q-title">{questions[currentStep].title}</h2>
          <p className="q-desc">{questions[currentStep].description}</p>
          <div className="options-grid">
            {questions[currentStep].options.map((opt, index) => (
              <button 
                key={index} 
                onClick={() => handleAnswer(opt.score)}
                className="btn-option"
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* --- 步驟 4：模擬掃描過渡 --- */}
      {currentStep === 4 && (
        <div className="scanning-stage">
          <div className="photo-container">
            <img src={imgSrc} alt="scanning" className="user-photo grayscale" />
            <div className="scanner-line"></div>
            <div className="warning-text status-blink">ANALYZING QUANTUM STATE...</div>
          </div>
          <h2 className="scanning-hint">正在比對靈魂頻率，請稍候...</h2>
        </div>
      )}

      {/* --- 步驟 5：最終結果與融合照片 --- */}
      {currentStep === 5 && (
        <div className="result-section">
          <div id="photo-area" className="photo-container">
            {/* 底層：觀眾拍照 */}
            <img src={imgSrc} alt="captured" className="user-photo" />

            {/* 頂層：湯川秀樹特徵融合 */}
            <img 
              src={yukawaPortrait} 
              alt="Yukawa Overlay" 
              className="yukawa-face-blend" 
              style={{ opacity: similarity / 150 }} /*湯川照片透明度調整 */
            />

            {/* 數位 UI 裝飾 */}
            <div className="scanner-line static-scan"></div>
            <div className={`warning-text ${isSuccess ? 'status-ok' : 'status-fail'}`}>
              {isSuccess ? "● BIOMETRIC MATCH: SUCCESS" : "○ ACCESS DENIED"}
            </div>

            {/* 成功戳章 */}
            {isSuccess && <div className="stamp">TOP SECRET</div>}
            
            <div className="result-overlay-text">
              SYNC: {similarity}%
            </div>
          </div>
          
          <div className="result-info">
            <h3>{isSuccess ? "時空躍遷授權成功" : "身分判定失敗"}</h3>
            <p>同步率：**{similarity}%**</p>
            <p className="final-msg">
              {isSuccess 
                ? "系統已鎖定 2026 年座標。準備傳送，祝你好運，探員。" 
                : "靈魂波長不穩定，無法啟動時光機。你將被留在 1954 年..."}
            </p>
          </div>

          <div className="button-group">
            <button onClick={() => {setCurrentStep(-1); setTotalScore(0);}} className="btn-retry">重新同步</button>
            <button onClick={downloadImage} className="btn-save">儲存探員證</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;