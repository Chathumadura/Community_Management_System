import React, { useState, useEffect } from "react";
import { FaCar, FaMotorcycle, FaShuttleVan, FaBicycle, FaTimes, FaDownload } from "react-icons/fa";
import { MdDirectionsCar, MdMoreHoriz } from "react-icons/md";
import "../../Css/vehicaleReg.css";


const VehicleRegisterForm = () => {
    const [vehicles, setVehicles] = useState([
        { vehicleNumber: "", vehicleType: "Car" }
    ]);
    const [userName, setUserName] = useState("");
    const [userId, setUserId] = useState("");
    const [qrCodeUrls, setQrCodeUrls] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState("");
    const [showQRModal, setShowQRModal] = useState(false);
    const [currentQRCode, setCurrentQRCode] = useState(null);

    useEffect(() => {
        const nameFromStorage = localStorage.getItem("userName");
        const idFromStorage = localStorage.getItem("userId");
        if (nameFromStorage && idFromStorage) {
            setUserName(nameFromStorage);
            setUserId(idFromStorage);
        }
    }, []);

    const handleVehicleChange = (index, field, value) => {
        const updatedVehicles = [...vehicles];
        updatedVehicles[index] = {
            ...updatedVehicles[index],
            [field]: value
        };
        setVehicles(updatedVehicles);
    };

    const addVehicle = () => {
        setVehicles([...vehicles, { vehicleNumber: "", vehicleType: "Car" }]);
    };

    const removeVehicle = (index) => {
        if (vehicles.length > 1) {
            const updatedVehicles = vehicles.filter((_, i) => i !== index);
            setVehicles(updatedVehicles);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        setError("");
        setQrCodeUrls([]);

        try {
            const registeredQrCodes = [];

            // Validate all vehicle numbers first
            for (const vehicle of vehicles) {
                if (!vehicle.vehicleNumber || !vehicle.vehicleNumber.trim()) {
                    setError("All vehicle numbers must be filled");
                    return;
                }
            }

            // Register each vehicle one by one
            for (const vehicle of vehicles) {
                // Create QR code data object with all the information
                const qrCodeData = {
                    residentId: userId,
                    name: userName,
                    vehicleNumber: vehicle.vehicleNumber,
                    vehicleType: vehicle.vehicleType,
                    timestamp: new Date().toISOString()
                };

                // Simulating QR code URL generation
                const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(qrCodeData))}`;

                registeredQrCodes.push({
                    qrCodeUrl,
                    vehicleNumber: vehicle.vehicleNumber,
                    vehicleType: vehicle.vehicleType
                });
            }

            setQrCodeUrls(registeredQrCodes);
            setSuccessMessage("Vehicles registered successfully!");
        } catch (err) {
            setError("Failed to register vehicles");
            console.error(err);
        }
    };

    const handleDownload = (url, vehicleNumber) => {
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `vehicle_qr_code_${vehicleNumber}.png`;
                link.click();
            })
            .catch((err) => {
                console.error("Failed to download QR code:", err);
            });
    };

    const openQRModal = (qrCode) => {
        setCurrentQRCode(qrCode);
        setShowQRModal(true);
    };

    const closeQRModal = () => {
        setShowQRModal(false);
        setCurrentQRCode(null);
    };

    const getVehicleIcon = (type) => {
        switch (type) {
            case 'Car': return <MdDirectionsCar className="vehicle-icon" />;
            case 'Motorbike': return <FaMotorcycle className="vehicle-icon" />;
            case 'Van': return <FaShuttleVan className="vehicle-icon" />;
            case 'Bicycle': return <FaBicycle className="vehicle-icon" />;
            default: return <MdMoreHoriz className="vehicle-icon" />;
        }
    };

    return (
        <div className="dark-theme">
            <div className="vehicle-reg-container">
                <div className="form-section">
                    <div className="form-header">
                        <div className="header-icon">
                            <FaCar />
                        </div>
                        <h2>Vehicle Registration</h2>
                        <p className="subtitle">Register your vehicles for secure parking access</p>
                    </div>

                    <form onSubmit={handleSubmit} className="registration-form">
                        <div className="form-group">
                            <label className="form-label">Resident Name</label>
                            <input
                                type="text"
                                value={userName}
                                className="form-input readonly"
                                readOnly
                            />
                        </div>

                        <input type="hidden" value={userId} />

                        {vehicles.map((vehicle, index) => (
                            <div key={index} className="vehicle-card">
                                <div className="card-header">
                                    <h3>Vehicle {index + 1}</h3>
                                    {vehicles.length > 1 && (
                                        <button
                                            type="button"
                                            className="remove-btn"
                                            onClick={() => removeVehicle(index)}
                                            aria-label="Remove vehicle"
                                        >
                                            <FaTimes />
                                        </button>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Vehicle Number</label>
                                    <input
                                        type="text"
                                        value={vehicle.vehicleNumber}
                                        onChange={(e) => handleVehicleChange(index, "vehicleNumber", e.target.value)}
                                        required
                                        placeholder="ABC-1234"
                                        className="form-input"
                                        autoComplete="off"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Vehicle Type</label>
                                    <select
                                        value={vehicle.vehicleType}
                                        onChange={(e) => handleVehicleChange(index, "vehicleType", e.target.value)}
                                        required
                                        className="form-select"
                                    >
                                        <option value="Car">Car</option>
                                        <option value="Motorbike">Motorbike</option>
                                        <option value="Van">Van</option>
                                        <option value="Three-Wheeler">Three-Wheeler</option>
                                        <option value="Bicycle">Bicycle</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        ))}

                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={addVehicle}
                            >
                                + Add Vehicle
                            </button>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Register Vehicles
                            </button>
                        </div>

                        {successMessage && (
                            <div className="alert alert-success">{successMessage}</div>
                        )}

                        {error && (
                            <div className="alert alert-error">{error}</div>
                        )}
                    </form>
                </div>

                {qrCodeUrls.length > 0 && (
                    <div className="qr-section">
                        <h3 className="qr-section-title">Your Vehicle QR Codes</h3>
                        <div className="qr-grid">
                            {qrCodeUrls.map((qrCode, index) => (
                                <div key={index} className="qr-card">
                                    <div className="qr-card-header">
                                        {getVehicleIcon(qrCode.vehicleType)}
                                        <span>{qrCode.vehicleType}</span>
                                    </div>
                                    <div className="qr-image-container" onClick={() => openQRModal(qrCode)}>
                                        <img src={qrCode.qrCodeUrl} alt="QR Code" />
                                    </div>
                                    <div className="qr-card-footer">
                                        <span>{qrCode.vehicleNumber}</span>
                                        <button 
                                            className="btn btn-icon"
                                            onClick={() => handleDownload(qrCode.qrCodeUrl, qrCode.vehicleNumber)}
                                            aria-label="Download QR code"
                                        >
                                            <FaDownload />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* QR Code Modal */}
            {showQRModal && currentQRCode && (
                <div className="modal-overlay">
                    <div className="qr-modal">
                        <div className="modal-header">
                            <h3>Vehicle QR Code</h3>
                            <button className="modal-close" onClick={closeQRModal}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="modal-qr-container">
                                <img src={currentQRCode.qrCodeUrl} alt="QR Code" />
                            </div>
                            <div className="modal-info">
                                <p><strong>Type:</strong> {currentQRCode.vehicleType}</p>
                                <p><strong>Number:</strong> {currentQRCode.vehicleNumber}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="btn btn-primary"
                                onClick={() => handleDownload(currentQRCode.qrCodeUrl, currentQRCode.vehicleNumber)}
                            >
                                <FaDownload /> Download QR Code
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VehicleRegisterForm;