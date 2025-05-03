import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ParkingSlotMap() {
    const [dashboard, setDashboard] = useState({ vehicles: [], slots: [] });
    const [error, setError] = useState(null);

    useEffect(() => {
        // Load saved data from localStorage (set by QR scanner or previous session)
        const savedData = localStorage.getItem('parkingData');
        if (savedData) {
            try {
                setDashboard(JSON.parse(savedData));
            } catch (e) {
                console.error("Error parsing saved parking data:", e);
            }
        }

        // Initial fetch
        fetchDashboard();

        // Event listener for real-time updates from other components
        const handleParkingUpdate = (event) => {
            console.log("Parking data updated:", event.detail);
            setDashboard(event.detail);
        };

        window.addEventListener('parking-data-updated', handleParkingUpdate);

        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchDashboard, 10000);

        return () => {
            window.removeEventListener('parking-data-updated', handleParkingUpdate);
            clearInterval(interval);
        };
    }, []);

    const fetchDashboard = async () => {
        try {
            const res = await axios.get('http://localhost:8070/api/dashboard');
            setDashboard(res.data);
            setError(null);
        } catch (err) {
            console.error('Dashboard fetch error:', err.message);
            setError('Failed to fetch dashboard data.');
        }
    };

    const freeSlot = async (slotNumber) => {
        try {
            await axios.post('http://localhost:8070/api/free_slot', { slot: slotNumber });
            await fetchDashboard();
            setError(null);
        } catch (err) {
            console.error('Free slot error:', err.message);
            setError('Failed to free the selected slot.');
        }
    };

    return (
        <div className="parking-map-container">
            <h2>Parking Slot Map</h2>

            {error && <p className="error-message">{error}</p>}

            <div className="slots-grid">
                {dashboard.slots.length > 0 ? (
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
                            {slot.status === 'occupied' && (
                                <div className="vehicle-info">
                                    {
                                        dashboard.vehicles.find(
                                            (v) => v.slot === slot.slotNumber
                                        )?.vehicleNumber || ''
                                    }
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No slots available.</p>
                )}
            </div>

            {/* Internal CSS Styling */}
            <style jsx>{`
                .parking-map-container {
                    padding: 20px;
                    background: linear-gradient(145deg, #0a0a0a, #1a1a1a);
                    color: #fff;
                    border-radius: 12px;
                    margin: 20px auto;
                    max-width: 900px;
                }

                h2 {
                    text-align: center;
                    color: #0ff;
                    margin-bottom: 20px;
                    font-size: 28px;
                }

                .error-message {
                    color: #ff4d4f;
                    background: #2c2c2c;
                    padding: 12px 20px;
                    margin: 10px 0;
                    border-radius: 8px;
                    font-weight: 500;
                    text-align: center;
                }

                .slots-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
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
                    height: 110px;
                }

                .slot-card.free {
                    background: #143d14;
                    border: 1px solid #0f0;
                    box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
                }

                .slot-card.occupied {
                    background: #3d1414;
                    border: 1px solid #f00;
                    box-shadow: 0 0 8px rgba(255, 0, 0, 0.3);
                }

                .slot-card:hover {
                    transform: scale(1.05);
                }

                .slot-number {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 8px;
                }

                .slot-status {
                    font-size: 14px;
                    opacity: 0.8;
                    margin-bottom: 8px;
                }

                .vehicle-info {
                    font-size: 12px;
                    background: rgba(0, 0, 0, 0.4);
                    padding: 4px 8px;
                    border-radius: 4px;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
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
}

export default ParkingSlotMap;
