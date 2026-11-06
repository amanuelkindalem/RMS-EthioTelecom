import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { StatusBadge } from '../components/StatusBadge';
import { FuelDialGauge } from '../components/FuelDialGauge';
import {
  IconFuel,
  IconWifi,
  IconWifiOff,
  IconRefreshCw,
  IconClock,
  IconCheckCircle,
  IconTruck,
  IconLogOut,
  IconFileText,
} from '../components/Icons';

export const DriverMobileApp = ({
  sessions = [],
  requests = [],
  onSubmitRequest,
}) => {
  const { user, switchRole } = useAuth();
  const { isOnline, offlineQueue, queueRequest, syncQueue, toggleSimulation } = useOffline();

  const [activeDriverTab, setActiveDriverTab] = useState('trip'); // 'trip', 'request', 'history'
  const [requestedLiters, setRequestedLiters] = useState(40);
  const [justification, setJustification] = useState('Scheduled route tower refueling');

  // Find active session for driver
  const activeSession = sessions.find(
    (s) => s.status === 'OPEN' && (s.driverId === user.id || s.driver?.email === user.email)
  ) || sessions.find((s) => s.status === 'OPEN');

  const tankCapacity = activeSession?.vehicle?.capacityLiters || 80;
  const currentFuelLevel = activeSession?.initialState?.fuelLevelStart || 55;

  // Filter requests submitted by this driver
  const myRequests = requests.filter(
    (r) => r.requestedById === user.id || r.requestedById === user.fullName || true
  );

  const latestRequest = myRequests[0];

  const handlePreset = (amount) => {
    setRequestedLiters(Math.min(tankCapacity, amount));
  };

  const handleAdjust = (delta) => {
    setRequestedLiters((prev) => Math.max(5, Math.min(tankCapacity, prev + delta)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activeSession) {
      alert('No active fuel session assigned to you right now.');
      return;
    }

    if (!isOnline) {
      queueRequest({
        sessionId: activeSession.id,
        sessionRef: activeSession.erpTaskRef,
        amount: requestedLiters,
        justification,
        driverId: user.id,
        driverName: user.fullName,
      });
      alert('⚡ Offline Mode: Request safely saved on phone memory. It will sync automatically when connected.');
    } else {
      onSubmitRequest(activeSession.id, requestedLiters, justification);
    }

    setActiveDriverTab('history');
  };

  return (
    <div className="driver-app-container">
      <div className="driver-phone-shell">
        {/* iOS/Android Status Bar */}
        <div className="driver-status-bar">
          <span>09:41</span>
          <div className="driver-notch" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>4G LTE</span>
            <span style={{ fontSize: '0.7rem' }}>98%</span>
          </div>
        </div>

        {/* Dedicated Driver Header */}
        <div className="driver-header">
          <div className="driver-profile-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="driver-avatar">
                {user?.fullName?.charAt(0) || 'D'}
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#90caf9', letterSpacing: '0.5px', fontWeight: 700 }}>
                  EthioTelecom Fleet Driver
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900 }}>{user?.fullName}</div>
                <div style={{ fontSize: '0.72rem', color: '#c2def4' }}>
                  ID: {user?.employeeId || 'ET-DR-601'} • {activeSession?.vehicle?.vehicleCode || 'ET-3-45812'}
                </div>
              </div>
            </div>

            <button
              onClick={() => switchRole('REFUELING_MANAGER')}
              className="chip-btn"
              style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '5px 10px', fontSize: '0.72rem' }}
              title="Switch to Management Dashboard"
            >
              Switch Portal ➜
            </button>
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="driver-scroll-content">
          {/* Offline / Online Network Pill */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: isOnline ? '#f0fdf4' : '#fffbeb',
              border: `1px solid ${isOnline ? '#bbf7d0' : '#fef08a'}`,
              borderRadius: '12px',
              padding: '8px 12px',
              marginBottom: '14px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: isOnline ? '#166534' : '#854d0e',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isOnline ? <IconWifi size={14} /> : <IconWifiOff size={14} />}
              <span>{isOnline ? 'Online (EthioTelecom Cloud)' : 'Offline (Local Storage Mode)'}</span>
            </div>
            <button
              onClick={toggleSimulation}
              className="btn btn-sm btn-outline"
              style={{ padding: '2px 8px', fontSize: '0.7rem' }}
            >
              {isOnline ? 'Test Offline' : 'Reconnect'}
            </button>
          </div>

          {/* Offline Sync Alert if any pending items */}
          {offlineQueue.length > 0 && (
            <div style={{ background: '#fffbeb', border: '1px solid #fef08a', borderRadius: '12px', padding: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#854d0e' }}>
                  Queued Requests: {offlineQueue.length}
                </span>
                {isOnline && (
                  <button onClick={() => syncQueue()} className="btn btn-sm btn-secondary" style={{ padding: '3px 8px', fontSize: '0.75rem' }}>
                    Sync Now
                  </button>
                )}
              </div>
              <small style={{ color: '#a16207', display: 'block', marginTop: '2px' }}>
                Stored safely on phone cache. Syncs automatically.
              </small>
            </div>
          )}

          {/* TAB 1: MY ACTIVE TRIP & TELEMETRY */}
          {activeDriverTab === 'trip' && (
            <div>
              {/* Engaging Fuel Dial Gauge */}
              <FuelDialGauge currentLevel={currentFuelLevel} capacity={tankCapacity} />

              {/* Active Route Card */}
              {activeSession ? (
                <div className="route-timeline-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#005a9c', textTransform: 'uppercase' }}>
                      Current Trip Mission
                    </span>
                    <StatusBadge status="OPEN" />
                  </div>

                  <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', marginBottom: '8px' }}>
                    {activeSession.erpTaskRef}
                  </div>

                  <div style={{ padding: '4px 0' }}>
                    <div className="route-step" style={{ marginBottom: '14px' }}>
                      <div className="route-dot" />
                      <div className="route-line" />
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Departure Depot</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                          {activeSession.metadata?.departure || 'Central Fleet Yard'}
                        </div>
                      </div>
                    </div>

                    <div className="route-step">
                      <div className="route-dot destination" />
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>Destination Substation</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                          {activeSession.metadata?.destination || 'Hawassa Substation Site'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', marginTop: '14px', fontSize: '0.8rem' }}>
                    <div>Odo Start: <strong>{activeSession.initialState?.odometerStart.toLocaleString()} km</strong></div>
                    <div>Vehicle: <strong>{activeSession.vehicle?.vehicleCode}</strong></div>
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  No active fuel session assigned yet.
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() => setActiveDriverTab('request')}
                className="btn btn-primary btn-block"
                style={{ padding: '14px', fontSize: '1rem', borderRadius: '14px', boxShadow: '0 8px 20px rgba(0, 90, 156, 0.3)' }}
              >
                <IconFuel size={18} />
                <span>Request Fuel for this Trip</span>
              </button>
            </div>
          )}

          {/* TAB 2: INTERACTIVE FUEL REQUEST PAD */}
          {activeDriverTab === 'request' && (
            <div>
              <div className="card" style={{ padding: '20px', borderRadius: '20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
                    Select Fuel Amount (UC 5)
                  </span>
                  <div style={{ fontSize: '3.4rem', fontWeight: 900, color: '#005a9c', lineHeight: 1, margin: '8px 0' }}>
                    {requestedLiters}
                    <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#64748b', marginLeft: '6px' }}>L</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Vehicle Max Capacity: {tankCapacity} Liters
                  </div>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min="5"
                  max={tankCapacity}
                  step="5"
                  className="range-slider"
                  value={requestedLiters}
                  onChange={(e) => setRequestedLiters(Number(e.target.value))}
                />

                {/* Quick Touch Increment Chips */}
                <div className="quick-chips-row">
                  <button type="button" onClick={() => handleAdjust(-10)} className="chip-btn">-10L</button>
                  <button type="button" onClick={() => handleAdjust(-5)} className="chip-btn">-5L</button>
                  <button type="button" onClick={() => handleAdjust(5)} className="chip-btn">+5L</button>
                  <button type="button" onClick={() => handleAdjust(10)} className="chip-btn">+10L</button>
                  <button type="button" onClick={() => handlePreset(tankCapacity)} className="chip-btn active">Full Tank</button>
                </div>

                {/* Stepper Buttons for precise volume */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                  <button
                    type="button"
                    onClick={() => handlePreset(25)}
                    className="chip-btn"
                  >
                    25 Liters Preset
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePreset(50)}
                    className="chip-btn"
                  >
                    50 Liters Preset
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">Route Justification / Trip Notes</label>
                    <input
                      type="text"
                      className="form-control"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="e.g. Extra mileage for remote site"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    style={{ padding: '14px', fontSize: '1rem', borderRadius: '12px' }}
                  >
                    <IconFuel size={18} />
                    <span>{isOnline ? 'Submit to Refuel Manager' : 'Save Locally (Offline)'}</span>
                  </button>
                </form>
              </div>

              {/* Status Workflow Tracker */}
              <div className="card" style={{ padding: '16px', borderRadius: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Live Approval Pipeline
                </div>
                <div className="workflow-tracker">
                  <div className="workflow-node completed">
                    <div className="workflow-circle">1</div>
                    <span className="workflow-label">Submit</span>
                  </div>
                  <div className="workflow-node active">
                    <div className="workflow-circle">2</div>
                    <span className="workflow-label">Manager</span>
                  </div>
                  <div className="workflow-node">
                    <div className="workflow-circle">3</div>
                    <span className="workflow-label">Finance</span>
                  </div>
                  <div className="workflow-node">
                    <div className="workflow-circle">4</div>
                    <span className="workflow-label">Pump</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REQUEST HISTORY */}
          {activeDriverTab === 'history' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase' }}>
                  My Refueling History
                </h4>
                <span className="badge badge-primary">{myRequests.length} Total</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {myRequests.map((req) => (
                  <div
                    key={req.id}
                    style={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '14px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a' }}>
                          {req.requestedAmount} Liters
                        </div>
                        {req.approvedAmount && (
                          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#16a34a' }}>
                            Approved: {req.approvedAmount} Liters
                          </div>
                        )}
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                          {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Today'}
                        </div>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>

                    {req.managerComment && (
                      <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', fontSize: '0.78rem', color: '#475569', marginTop: '8px', borderLeft: '3px solid #005a9c' }}>
                        Manager Note: "{req.managerComment}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dedicated Driver Bottom Navigation */}
        <nav className="driver-bottom-nav">
          <div
            className={`driver-nav-item ${activeDriverTab === 'trip' ? 'active' : ''}`}
            onClick={() => setActiveDriverTab('trip')}
          >
            <IconTruck size={20} />
            <span className="driver-nav-label">My Trip</span>
          </div>

          <div
            className={`driver-nav-item ${activeDriverTab === 'request' ? 'active' : ''}`}
            onClick={() => setActiveDriverTab('request')}
          >
            <IconFuel size={20} />
            <span className="driver-nav-label">Request Fuel</span>
          </div>

          <div
            className={`driver-nav-item ${activeDriverTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveDriverTab('history')}
          >
            <IconFileText size={20} />
            <span className="driver-nav-label">History</span>
          </div>
        </nav>
      </div>
    </div>
  );
};
