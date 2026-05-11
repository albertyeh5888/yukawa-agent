import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import html2canvas from 'html2canvas';
import './App.css';


import yukawaPortrait from './assets/yukawa-portrait.png';

// 題庫設定：你可以隨時在這裡修改文字或分數
const questions = [
  {
    id: 1,
    title: "展品一一：面對混沌不明的難題",
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
    description: "面對這個充滿仇恨與圍牆的時代，你的第一直覺是？",
    options: [
      { text: "類型A(理性實踐者)：即使現實混亂，更應守住真理", score: 0.6 },
      { text: "類型B(湯川型/觀察者)：如果世界毀滅，任何真理都將毫無意義", score: 1.0 }
    ]
  }
];

function App() {
  // --- 狀態管理 ---
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [currentStep, setCurrentStep] = useState(-1); // -1: 歡迎/拍照, 0~3: 題目, 4: 結果
  const [totalScore, setTotalScore] = useState(0);

  // --- 邏輯功能 ---
  
  // 1. 拍照並進入第一題
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setCurrentStep(0); // 直接進入第一題
  };

  // 2. 處理答題
  const handleAnswer = (score) => {
    setTotalScore(prev => prev + score);
    setCurrentStep(prev => prev + 1);
  };

  // 3. 儲存圖片
  const downloadImage = async () => {
    const element = document.getElementById('photo-area');
    const canvas = await html2canvas(element);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'yukawa-agent-id.png';
    link.click();
  };

  // 計算相似度
  const similarity = ((totalScore / questions.length) * 100).toFixed(0);

  // --- 畫面渲染 ---
  return (
    <div className="app-container">
      <h1>時空探員：思維同步計畫</h1>

      {/* 步驟 -1：拍照獲取身分 */}
      {currentStep === -1 && (
        <div className="camera-section">
          <p className="instruction">請掃描臉部以獲取時空探員身分...</p>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam-view"
          />
          <button onClick={capture} className="btn-main">啟動探員辨識</button>
        </div>
      )}

      {/* 步驟 0~3：問答階段 */}
      {currentStep >= 0 && currentStep < questions.length && (
        <div className="question-section">
          <div className="progress-bar">
            探員同步進度：{currentStep + 1} / {questions.length}
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

      {/* 步驟 4：最終結果與融合照片 */}
      {currentStep === questions.length && (
        <div className="result-section">
          <div id="photo-area" className="photo-container">
            {/* 底層：觀眾的濾鏡照片 */}
            <img src={imgSrc} alt="captured" className="user-photo" />

             {/* 頂層：湯川秀樹頭像 (依同步率控制透明度) */}
            <img 
              src={yukawaPortrait} 
              alt="Yukawa Overlay" 
              className="yukawa-face-blend" 
              style={{ 
              // 關鍵邏輯：同步率 80%，透明度就是 0.8
              opacity: similarity / 100 
             }} 
           />

           {/* 裝飾用的掃描線或文字 */}
           <div className="result-overlay-text">
            IDENTITY CONFIRMED: {similarity}%
           </div>
        </div>
          
          <div className="result-info">
            <h3>身分確認成功</h3>
            <p>你與湯川秀樹的思想同步率達到了 **{similarity}%**。</p>
            <p className="final-msg">「先於實驗的先驗洞察力」正在你的意識中覺醒。</p>
          </div>

          <div className="button-group">
            <button onClick={() => {setCurrentStep(-1); setTotalScore(0);}} className="btn-retry">重新掃描</button>
            <button onClick={downloadImage} className="btn-save">儲存探員識別證</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
