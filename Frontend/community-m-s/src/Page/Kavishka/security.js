import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import moment from 'moment';

const VehicleQRScanner = () => {
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState('');
    const [departureTime, setDepartureTime] = useState('');
    const [allocatedSlot, setAllocatedSlot] = useState(null);
    const [dashboard, setDashboard] = useState({ vehicles: [], slots: [] });
    const scannerId = "qr-reader";

    useEffect(() => {
        fetchDashboard(); // Fetch initial dashboard data
        const html5QrCode = new Html5Qrcode(scannerId);
        let isScannerRunning = false;

        // Set up refreshing dashboard data every 5 seconds
        const dashboardInterval = setInterval(() => {
            fetchDashboard();
        }, 5000);

        Html5Qrcode.getCameras()
            .then(devices => {
                if (devices && devices.length) {
                    const cameraId = devices[0].id;

                    html5QrCode.start(
                        cameraId,
                        { fps: 10, qrbox: 250 },
                        (decodedText) => {
                            try {
                                // Reset previous states
                                setScanResult(null);
                                setAllocatedSlot(null);
                                setError('');
                                const parsed = JSON.parse(decodedText);
                                setScanResult(parsed);
                                fetchDepartureAndAllocate(parsed);
                                html5QrCode.stop().then(() => {
                                    isScannerRunning = false;
                                }).catch(console.error);
                            } catch (err) {
                                setError("❌ Invalid QR Code format. Please scan a valid vehicle QR code.");
                                console.error("QR Parse Error:", err);
                            }
                        },
                        (err) => { /* scan errors ignored */ }
                    ).then(() => {
                        isScannerRunning = true;
                    }).catch(err => {
                        setError("❌ Failed to start scanner: " + err);
                    });
                }
            })
            .catch(err => {
                setError("❌ Camera access error: " + err);
            });

        return () => {
            if (isScannerRunning) {
                html5QrCode.stop().catch(() => { });
            }
            clearInterval(dashboardInterval);
        };
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await axios.get('http://localhost:8070/api/dashboard');
            setDashboard(res.data);
            localStorage.setItem('parkingData', JSON.stringify(res.data));
            const event = new CustomEvent('parking-data-updated', { detail: res.data });
            window.dispatchEvent(event);
        } catch (err) {
            console.error('Dashboard fetch error:', err.message);
            setError('Failed to fetch dashboard data.');
        }
    };

    const fetchDepartureAndAllocate = async (vehicleData) => {
        try {
            await fetchDashboard();

            const isVehicleAllocated = dashboard.vehicles.some(
                (vehicle) =>
                    vehicle.vehicleNumber.toLowerCase() === vehicleData.vehicleNumber.toLowerCase() &&
                    vehicle.slot !== null &&
                    vehicle.slot !== undefined
            );

            if (isVehicleAllocated) {
                const allocatedVehicle = dashboard.vehicles.find(
                    (vehicle) => vehicle.vehicleNumber.toLowerCase() === vehicleData.vehicleNumber.toLowerCase()
                );
                setError(`❌ Vehicle ${vehicleData.vehicleNumber} is already allocated to slot ${allocatedVehicle.slot}.`);
                return;
            }

            const res = await axios.get('http://localhost:8070/api/leavetime/latest');
            const { departureTimes } = res.data;

            const tomorrowIndex = (new Date().getDay() + 1) % 7;
            const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const tomorrow = weekdays[tomorrowIndex];

            const time = departureTimes[tomorrow];
            if (!time) {
                setDepartureTime("❌ No departure time set for tomorrow.");
                return;
            }

            setDepartureTime(time);

            const payload = {
                vehicleNumber: vehicleData.vehicleNumber,
                vehicleType: vehicleData.vehicleType,
                leavingTime: time,
                entryTime: moment().format('YYYY-MM-DD HH:mm'),
            };

            const allocateRes = await axios.post('http://localhost:8070/api/allocate_slot', payload);
            const slot = typeof allocateRes.data === 'object' && allocateRes.data.slot ? allocateRes.data.slot : allocateRes.data;
            setAllocatedSlot(slot);

            await fetchDashboard();
        } catch (err) {
            console.error("Auto Allocation Error:", err.response?.data?.error || err.message);
            setError("❌ Failed to allocate parking slot: " + (err.response?.data?.error || err.message));
        }
    };

    const freeSlot = async (slot) => {
        try {
            await axios.post('http://localhost:8070/api/free_slot', { slot });
            await fetchDashboard();
            setError('');
        } catch (err) {
            console.error('Free slot error:', err.message);
            setError('Failed to free slot.');
        }
    };

    return (
        <div className="scanner-page">
            <header className="scanner-header">
                <h1 className="scanner-title">🚘 Vehicle Entry Scan</h1>
                <p className="scanner-subtitle">Scan the QR code to auto-allocate your parking slot</p>
            </header>

            

            <div id={scannerId} className="qr-scanner-box"></div>

            {error && <div className="error-message">{error}</div>}

            {scanResult && (
                <div className="popup-card animate-slide-up">
                    <h2>{scanResult.name}</h2>
                    <p><strong>Vehicle:</strong> {scanResult.vehicleNumber}</p>
                    <p><strong>Type:</strong> {scanResult.vehicleType}</p>
                    <p><strong>Tomorrow's Departure:</strong> {departureTime}</p>
                    {allocatedSlot && (
                        <p className="allocated-slot">
                            ✅ Allocated Slot: <strong>{allocatedSlot}</strong>
                        </p>
                    )}
                </div>
            )}

            <div className="slot-map">
                <h2>Current Parking Status</h2>
                <div className="slots-grid">
                    {dashboard.slots && dashboard.slots.length > 0 ? (
                        dashboard.slots.map((slot) => (
                            <div
                                key={slot.slotNumber}
                                className={`slot-card ${slot.status === 'free' ? 'free' : 'occupied'}`}
                                onClick={() => slot.status === 'occupied' && freeSlot(slot.slotNumber)}
                            >
                                <div className="slot-number">Slot {slot.slotNumber}</div>
                                <div className="slot-status">
                                    {slot.status === 'occupied' ? 'Occupied' : 'Free'}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No slots available.</p>
                    )}
                </div>
            </div>

            <style>{`
                .scanner-page {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background: linear-gradient(145deg, #0a0a0a, #1a1a1a);
                    color: #fff;
                    min-height: 100vh;
                    padding: 40px 20px;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    overflow-x: hidden;
                }

                .scanner-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .scanner-title {
                    font-size: 3rem;
                    color: #0ff;
                    font-weight: 700;
                    animation: pulse 2s infinite;
                }

                .scanner-subtitle {
                    font-size: 1.2rem;
                    color: #aaa;
                    margin-top: 10px;
                }

                @keyframes pulse {
                    0%, 100% { text-shadow: 0 0 5px #0ff; }
                    50% { text-shadow: 0 0 15px #0ff; }
                }

                .qr-scanner-box {
                    width: 320px;
                    padding: 12px;
                    background: #222;
                    border-radius: 12px;
                    box-shadow: 0 0 12px #0f0;
                }

                .error-message {
                    color: #ff4d4f;
                    background: #2c2c2c;
                    padding: 12px 20px;
                    margin-top: 10px;
                    border-radius: 8px;
                    font-weight: 500;
                    text-align: center;
                }

                .popup-card {
                    margin-top: 30px;
                    margin-bottom: 30px;
                    background: #000;
                    border: 2px solid #0f0;
                    border-radius: 20px;
                    padding: 30px;
                    width: 90%;
                    max-width: 450px;
                    text-align: center;
                    box-shadow: 0 0 25px #0f0;
                }

                .popup-card h2 {
                    font-size: 32px;
                    color: #0ff;
                    margin-bottom: 15px;
                }

                .popup-card p {
                    font-size: 20px;
                    margin: 10px 0;
                }

                .allocated-slot {
                    color: #0f0;
                    font-size: 24px;
                    margin-top: 20px;
                    font-weight: bold;
                }

                .animate-slide-up {
                    animation: slideUp 0.7s ease-out;
                }

                @keyframes slideUp {
                    from { transform: translateY(50px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .slot-map {
                    width: 90%;
                    max-width: 800px;
                    margin-top: 20px;
                    background: rgba(10, 10, 10, 0.7);
                    border-radius: 12px;
                    padding: 20px;
                    border: 1px solid #333;
                }

                .slot-map h2 {
                    text-align: center;
                    color: #0ff;
                    margin-bottom: 20px;
                }

                .slots-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 15px;
                }

                .slot-card {
                    padding: 12px;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .slot-card.free {
                    background: #143d14;
                    border: 1px solid #0f0;
                }

                .slot-card.occupied {
                    background: #3d1414;
                    border: 1px solid #f00;
                }

                .slot-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
                }

                .slot-number {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .slot-status {
                    font-size: 14px;
                    opacity: 0.8;
                }

                .free .slot-status {
                    color: #0f0;
                }

                .occupied .slot-status {
                    color: #f88;
                }
            `}</style>
        </div>
    );
};

export default VehicleQRScanner;
