import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
import html2canvas from 'html2canvas';
import './App.css';

function App() {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [isCaptured, setIsCaptured] = useState(false);

  // 拍照功能
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
    setIsCaptured(true);
  };

  // 儲存融合後的照片
  const downloadImage = async () => {
    const element = document.getElementById('photo-area');
    const canvas = await html2canvas(element);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'yukawa-agent-id.png';
    link.click();
  };

  return (
    <div className="app-container">
      <h1>時空探員：思維同步計畫</h1>
      
      {!isCaptured ? (
        <div className="camera-section">
          <p>請掃描臉部以獲取時空探員身分...</p>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam-view"
          />
          <button onClick={capture} className="btn-capture">啟動探員辨識</button>
        </div>
      ) : (
        <div className="result-section">
          <div id="photo-area" className="photo-container">
            {/* 觀眾的照片 */}
            <img src={imgSrc} alt="captured" className="user-photo" />
            {/* 湯川濾鏡層 (可以是一張半透明的湯川頭像或眼鏡圖案) */}
            <div className="yukawa-overlay"></div>
            <div className="scan-line"></div>
          </div>
          <p>身分確認成功：湯川秀樹思維同步中...</p>
          <button onClick={() => setIsCaptured(false)} className="btn-retry">重新掃描</button>
          <button onClick={downloadImage} className="btn-save">儲存探員識別證</button>
        </div>
      )}
    </div>
  );
}

export default App;