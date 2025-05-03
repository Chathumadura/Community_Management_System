import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../Css/Rasindu/AttendanceForm.css';

const QrScan = () => {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [checkInDone, setCheckInDone] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const qrRef = useRef(null);
  const html5QrCodeRef = useRef(null);
  const navigate = useNavigate();

  const handleScan = async (decodedText) => {
    try {
      const parsed = JSON.parse(decodedText);
      const empId = parsed.employeeId;
      const now = new Date();

      if (checkInDone && checkInTime && (now - checkInTime) < 30000) {
        setMessage("Please wait at least 30 seconds before check-out.");
        setSuccess(false);
        return;
      }

      const res = await axios.post("http://localhost:8070/attendance/mark", { empId });

      setMessage(res.data.message);
      setSuccess(true);

      if (res.data.message === 'Check-in successful') {
        setCheckInDone(true);
        setCheckInTime(now);
      } else if (res.data.message === 'Check-out successful') {
        setCheckInDone(false);
        setCheckInTime(null);
      }

      setTimeout(() => {
        setMessage('');
      }, 5000);

    } catch (err) {
      console.error("QR Error:", err);
      setMessage("Invalid QR or Attendance Error");
      setSuccess(false);
    }
  };

  useEffect(() => {
    const scannerId = "reader";
    html5QrCodeRef.current = new Html5Qrcode(scannerId);

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;

        html5QrCodeRef.current.start(
          cameraId,
          {
            fps: 10,
            qrbox: 250,
          },
          handleScan,
          (err) => {
            console.warn("Scan error:", err);
          }
        );
      }
    }).catch(err => {
      console.error("Camera error:", err);
      setMessage("Camera not accessible");
      setSuccess(false);
    });

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current.clear();
        }).catch(err => console.error("Stop error:", err));
      }
    };
  }, []);

  return (
    <div className="qr-scan-containerRa">
      <button onClick={() => navigate(-1)} className="qr-scan-back-btnRa">&larr; Back</button>
      <h2>Scan Employee QR Code</h2>
      <div id="reader" ref={qrRef} style={{ width: "300px", margin: "auto" }}></div>

      {message && (
        <div className={`qr-scan-messageRa ${success ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default QrScan;