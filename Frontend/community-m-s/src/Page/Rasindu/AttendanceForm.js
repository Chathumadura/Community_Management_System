import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Css/Rasindu/AttendanceForm.css';

const QrScan = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const qrRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate();

  const handleScan = async (decodedText) => {
    try {
      // Pause scanning temporarily
      if (html5QrCodeRef.current && isScanning) {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
      }

      const parsed = JSON.parse(decodedText);
      if (!parsed.employeeId) {
        throw new Error("Invalid QR format: Missing employeeId");
      }

      const res = await axios.post("http://localhost:8070/attendance/mark", { 
        empId: parsed.employeeId 
      });

      setMessage(res.data.message);
      setSuccess(true);

      setTimeout(() => {
        setMessage('');
        startScanner(); // Resume scanning
      }, 3000);

    } catch (err) {
      console.error("QR Error:", err);
      setMessage(err.response?.data?.message || err.message || "Invalid QR or Attendance Error");
      setSuccess(false);
      
      setTimeout(() => {
        setMessage('');
        startScanner(); // Resume scanning after error
      }, 3000);
    }
  };

  const startScanner = async () => {
    if (html5QrCodeRef.current && !isScanning) {
      try {
        const devices = await Html5Qrcode.getCameras();
        if (devices && devices.length) {
          await html5QrCodeRef.current.start(
            devices[0].id,
            {
              fps: 10,
              qrbox: { width: 250, height: 250 },
            },
            (decodedText) => {
              handleScan(decodedText);
            },
            (errorMessage) => {
              console.log("QR Code scan error", errorMessage);
            }
          );
          setIsScanning(true);
        } else {
          setMessage("No camera device found");
          setSuccess(false);
        }
      } catch (err) {
        console.error("Camera error:", err);
        setMessage("Camera not accessible");
        setSuccess(false);
      }
    }
  };

  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode("reader");
    startScanner();

    return () => {
      if (html5QrCodeRef.current && isScanning) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current.clear();
        }).catch(err => console.error("Stop error:", err));
      }
    };
  }, []);

  return (
    <div className="qr-scan-containerRa">
      <button onClick={() => navigate(-1)} className="qr-scan-back-btnRa">
        &larr; Back
      </button>
      <h2>Scan Employee QR Code</h2>
      <div id="reader" ref={qrRef}></div>

      {message && (
        <div className={`qr-scan-messageRa ${success ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default QrScan;