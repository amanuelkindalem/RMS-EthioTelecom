import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  IconFuel,
  IconCheckCircle,
  IconAlertTriangle,
  IconDollarSign,
  IconTruck,
  IconClock,
  IconPlus,
} from '../components/Icons';
import { StatusBadge } from '../components/StatusBadge';

export const DashboardView = ({
  sessions = [],
  requests = [],
  fraudCases = [],
  vehicles = [],
  onNavigate,
}) => {
  const { user, role } = useAuth();

  const activeSessions = sessions.filter((s) => s.status === 'OPEN');
  const pendingRequests = requests.filter((r) => r.status === 'PENDING');
  const openFraudCases = fraudCases.filter((f) => !f.resolved);

  // Active or latest session for primary fuel meter card
  const currentSession = activeSessions[0] || sessions[0];
  const fuelLevel = currentSession?.initialState?.fuelLevelStart || 65;
  const tankCapacity = currentSession?.vehicle?.capacityLiters || 80;
  const fuelPercent = Math.min(100, Math.round((fuelLevel / tankCapacity) * 100));

  return (
    <div>
      {/* Visual Fuel Tank Gauge Card */}
      <div className="fuel-gauge-card">
        <div className="fuel-gauge-title">EthioTelecom Active Fleet Telemetry</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div className="fuel-gauge-val">{fuelLevel} L</div>
            <div style={{ fontSize: '0.8rem', color: '#c2def4' }}>
              {currentSession?.vehicle?.vehicleCode || 'Fleet Vehicle'} • {currentSession?.erpTaskRef || 'No Active Task'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span className="badge badge-success" style={{ background: '#7cb342', color: 'white' }}>
              {fuelPercent}% Tank Level
            </span>
          </div>
        </div>

        <div className="fuel-meter-bar-container">
          <div className="fuel-meter-bar-fill" style={{ width: `${fuelPercent}%` }} />
        </div>

        <div className="fuel-meter-labels">
          <span>0L (Empty)</span>
          <span>Capacity: {tankCapacity} Liters</span>
        </div>
      </div>

      {/* 2x2 Metric Row for Mobile Thumb Tap */}
      <div className="metric-row">
        <div className="metric-pill" onClick={() => onNavigate('fuel-sessions')} style={{ cursor: 'pointer' }}>
          <div className="metric-pill-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
            <IconFuel size={20} />
          </div>
          <div>
            <div className="metric-pill-label">Active Trips</div>
            <div className="metric-pill-value">{activeSessions.length}</div>
          </div>
        </div>

        <div className="metric-pill" onClick={() => onNavigate('approvals')} style={{ cursor: 'pointer' }}>
          <div className="metric-pill-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <IconCheckCircle size={20} />
          </div>
          <div>
            <div className="metric-pill-label">Approvals</div>
            <div className="metric-pill-value">{pendingRequests.length}</div>
          </div>
        </div>

        <div className="metric-pill" onClick={() => onNavigate('reports')} style={{ cursor: 'pointer' }}>
          <div className="metric-pill-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <IconAlertTriangle size={20} />
          </div>
          <div>
            <div className="metric-pill-label">Discrepancies</div>
            <div className="metric-pill-value">{openFraudCases.length}</div>
          </div>
        </div>

        <div className="metric-pill" onClick={() => onNavigate('driver-app')} style={{ cursor: 'pointer' }}>
          <div className="metric-pill-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <IconTruck size={20} />
          </div>
          <div>
            <div className="metric-pill-label">Driver Desk</div>
            <div className="metric-pill-value">Open ➜</div>
          </div>
        </div>
      </div>

      {/* Active Trips Card */}
      <div className="mobile-card">
        <div className="mobile-card-header">
          <h3 className="mobile-card-title">Live Fuel Sessions ({activeSessions.length})</h3>
          <button
            onClick={() => onNavigate('fuel-sessions')}
            className="btn-mobile btn-mobile-sm btn-mobile-outline"
          >
            Manage
          </button>
        </div>

        {activeSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px', color: '#94a3b8', fontSize: '0.85rem' }}>
            No active trips in transit.
          </div>
        ) : (
          activeSessions.map((s) => (
            <div
              key={s.id}
              style={{
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '12px',
                marginBottom: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#005a9c', fontSize: '0.9rem' }}>
                  {s.erpTaskRef}
                </span>
                <StatusBadge status={s.status} />
              </div>
              <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '4px' }}>
                Vehicle: <strong>{s.vehicle?.vehicleCode}</strong> • Driver: {s.driver?.fullName}
              </div>
              {s.metadata && (
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  Route: {s.metadata.departure} ➜ {s.metadata.destination}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quick Action Button */}
      <button
        onClick={() => onNavigate('driver-app')}
        className="btn-mobile btn-mobile-primary"
        style={{ marginTop: '10px' }}
      >
        <IconFuel size={18} />
        <span>Request Fuel / Enter Driver Portal</span>
      </button>
    </div>
  );
};
