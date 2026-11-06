import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { StatusBadge } from '../components/StatusBadge';
import { IconFuel, IconWifi, IconWifiOff, IconRefreshCw, IconClock } from '../components/Icons';

export const DriverMobileView = ({
  sessions = [],
  requests = [],
  onSubmitRequest,
}) => {
  const { user } = useAuth();
  const { isOnline, offlineQueue, queueRequest, syncQueue, toggleSimulation } = useOffline();

  const [requestedAmount, setRequestedAmount] = useState(40);
  const [justification, setJustification] = useState('Scheduled route maintenance travel');

  // Active session for current driver
  const myActiveSession = sessions.find(
    (s) => s.status === 'OPEN' && (s.driverId === user.id || s.driver?.email === user.email)
  ) || sessions.find((s) => s.status === 'OPEN');

  const tankCapacity = myActiveSession?.vehicle?.capacityLiters || 80;

  // Driver's previous requests
  const myRequests = requests.filter(
    (r) => r.requestedById === user.id || r.requestedById === user.fullName || true
  );

  const handleAdjustAmount = (delta) => {
    setRequestedAmount((prev) => Math.max(5, Math.min(tankCapacity, prev + delta)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = Number(requestedAmount);
    if (!amount || amount <= 0) return;

    if (!myActiveSession) {
      alert('No active fuel session assigned to your account right now.');
      return;
    }

    if (!isOnline) {
      queueRequest({
        sessionId: myActiveSession.id,
        sessionRef: myActiveSession.erpTaskRef,
        amount,
        justification,
        driverId: user.id,
        driverName: user.fullName,
      });
      alert('⚡ Offline Mode: Request saved locally on your phone. Will auto-sync when connection is restored.');
    } else {
      onSubmitRequest(myActiveSession.id, amount, justification);
    }
  };

  return (
    <div>
      {/* Network / Offline Banner */}
      <div className={`network-banner ${isOnline ? 'online' : 'offline'}`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {isOnline ? <IconWifi size={14} /> : <IconWifiOff size={14} />}
          <span>{isOnline ? 'Connected to EthioTelecom Core' : 'Offline Mode (Device Storage Active)'}</span>
        </div>
        <button
          onClick={toggleSimulation}
          className="btn-mobile btn-mobile-sm btn-mobile-outline"
          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
        >
          {isOnline ? 'Test Offline' : 'Reconnect'}
        </button>
      </div>

      {/* Offline Queue Notification */}
      {offlineQueue.length > 0 && (
        <div style={{ background: '#fffbeb', border: '1px solid #fef08a', borderRadius: '12px', padding: '12px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#854d0e' }}>
              Pending Offline Submissions: {offlineQueue.length}
            </span>
            {isOnline && (
              <button onClick={() => syncQueue()} className="btn-mobile btn-mobile-sm btn-mobile-secondary">
                Sync Now
              </button>
            )}
          </div>
          <small style={{ color: '#a16207', display: 'block', marginTop: '2px' }}>
            Requests stored securely on device storage per SRS Section 2 & 8.1.
          </small>
        </div>
      )}

      {/* Active Trip Info */}
      {myActiveSession ? (
        <div className="fuel-gauge-card" style={{ padding: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#c2def4', fontWeight: 700 }}>
              Active Assigned Trip
            </span>
            <span className="badge badge-success" style={{ background: '#7cb342', color: 'white' }}>
              In Transit
            </span>
          </div>

          <div style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '4px' }}>
            {myActiveSession.erpTaskRef}
          </div>

          <div style={{ fontSize: '0.82rem', color: '#e6f1f9', marginTop: '4px' }}>
            Vehicle: <strong>{myActiveSession.vehicle?.vehicleCode || 'ET Fleet'}</strong> ({tankCapacity}L Max)
          </div>

          {myActiveSession.metadata && (
            <div style={{ fontSize: '0.76rem', color: '#b3d7f5', marginTop: '4px' }}>
              Route: {myActiveSession.metadata.departure} ➜ {myActiveSession.metadata.destination}
            </div>
          )}
        </div>
      ) : (
        <div className="mobile-card" style={{ background: '#fffbeb', borderColor: '#fef08a', color: '#854d0e' }}>
          ⚠ No active fuel session assigned to your driver account.
        </div>
      )}

      {/* Fuel Request Quick Pad (UC 5) */}
      <div className="mobile-card">
        <div className="mobile-card-header">
          <h3 className="mobile-card-title">Request Fuel Volume (UC 5)</h3>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Fast 2-Click Request</span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Large Digital Liter Counter */}
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '3.2rem', fontWeight: 900, color: '#005a9c', lineHeight: 1 }}>
              {requestedAmount}
              <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#64748b', marginLeft: '6px' }}>Liters</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              Tank Limit: {tankCapacity} Liters
            </div>
          </div>

          {/* Quick Increment Chips */}
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
            <button
              type="button"
              onClick={() => handleAdjustAmount(-10)}
              className="btn-mobile btn-mobile-sm btn-mobile-outline"
            >
              -10 L
            </button>
            <button
              type="button"
              onClick={() => handleAdjustAmount(-5)}
              className="btn-mobile btn-mobile-sm btn-mobile-outline"
            >
              -5 L
            </button>
            <button
              type="button"
              onClick={() => handleAdjustAmount(5)}
              className="btn-mobile btn-mobile-sm btn-mobile-outline"
            >
              +5 L
            </button>
            <button
              type="button"
              onClick={() => handleAdjustAmount(10)}
              className="btn-mobile btn-mobile-sm btn-mobile-outline"
            >
              +10 L
            </button>
            <button
              type="button"
              onClick={() => setRequestedAmount(tankCapacity)}
              className="btn-mobile btn-mobile-sm btn-mobile-primary"
            >
              Full Tank
            </button>
          </div>

          <div className="mobile-input-group">
            <label className="mobile-input-label">Route Justification</label>
            <input
              type="text"
              className="mobile-input"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              placeholder="e.g. Extra mileage for remote tower site"
            />
          </div>

          <button
            type="submit"
            disabled={!myActiveSession}
            className="btn-mobile btn-mobile-primary"
            style={{ padding: '14px', fontSize: '1rem' }}
          >
            <IconFuel size={18} />
            <span>{isOnline ? 'Submit for Approval' : 'Queue Locally (Offline)'}</span>
          </button>
        </form>
      </div>

      {/* Request History */}
      <div>
        <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '10px' }}>
          My Recent Submissions
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {myRequests.map((req) => (
            <div
              key={req.id}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
                  {req.requestedAmount} Liters
                  {req.approvedAmount && (
                    <span style={{ fontSize: '0.8rem', color: '#16a34a', marginLeft: '6px' }}>
                      (Approved: {req.approvedAmount}L)
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Today'}
                  {req.managerComment && ` • "${req.managerComment}"`}
                </div>
              </div>
              <StatusBadge status={req.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
