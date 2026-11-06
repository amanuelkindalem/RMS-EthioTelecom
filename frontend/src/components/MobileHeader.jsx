import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { RoleBadge } from './StatusBadge';
import { IconWifi, IconWifiOff, IconRefreshCw, IconUsers } from './Icons';

export const MobileHeader = ({ title = 'EthioTelecom RMS', onOpenRoleDrawer }) => {
  const { user, role, switchRole } = useAuth();
  const { isOnline, toggleSimulation, offlineQueue, syncQueue } = useOffline();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const roles = [
    { key: 'DRIVER', label: 'Driver (Mobile Desk)' },
    { key: 'REFUELING_TEAM', label: 'Refuel Team' },
    { key: 'REFUELING_MANAGER', label: 'Refuel Manager' },
    { key: 'FINANCE', label: 'Finance Team' },
    { key: 'FUEL_ADMIN', label: 'Fuel Fleet Admin' },
    { key: 'BRANCH_ADMIN', label: 'Branch Admin' },
    { key: 'HQ_ADMIN', label: 'HQ Admin' },
  ];

  return (
    <>
      {/* iOS/Android Status Bar */}
      <div className="mobile-status-bar">
        <span>09:41</span>
        <div className="mobile-notch-pill" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>4G</span>
          <span style={{ fontSize: '0.7rem' }}>100%</span>
        </div>
      </div>

      {/* Main Mobile App Header */}
      <header className="mobile-header">
        <div className="mobile-brand">
          <div className="mobile-brand-icon">ET</div>
          <div>
            <div className="mobile-brand-name">RMS Mobile</div>
            <div className="mobile-brand-tag">EthioTelecom</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Quick Offline toggle */}
          <button
            onClick={toggleSimulation}
            className="role-chip-btn"
            style={{
              background: isOnline ? '#f0fdf4' : '#fffbeb',
              borderColor: isOnline ? '#bbf7d0' : '#fef08a',
              color: isOnline ? '#15803d' : '#b45309',
            }}
            title="Toggle Online / Offline (SRS simulation)"
          >
            {isOnline ? <IconWifi size={13} /> : <IconWifiOff size={13} />}
            <span>{isOnline ? 'Online' : 'Offline'}</span>
          </button>

          {/* Role Switcher Pill */}
          <button
            onClick={() => setShowRoleMenu(true)}
            className="role-chip-btn"
            title="Switch User Role"
          >
            <span>{role.replace('_', ' ')}</span>
            <span style={{ fontSize: '0.65rem' }}>▼</span>
          </button>
        </div>
      </header>

      {/* Role Selection Sheet */}
      {showRoleMenu && (
        <div className="bottom-sheet-overlay" onClick={() => setShowRoleMenu(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle" />
            <div className="bottom-sheet-header">
              <h3 className="bottom-sheet-title">Switch Active Role</h3>
              <button
                className="btn-mobile btn-mobile-sm btn-mobile-outline"
                onClick={() => setShowRoleMenu(false)}
              >
                ✕
              </button>
            </div>
            <div className="bottom-sheet-body">
              <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '12px' }}>
                Select a user persona to explore different workflows specified in the EthioTelecom SRS.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {roles.map((r) => (
                  <button
                    key={r.key}
                    onClick={() => {
                      switchRole(r.key);
                      setShowRoleMenu(false);
                    }}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: role === r.key ? '2px solid #005a9c' : '1px solid #e2e8f0',
                      background: role === r.key ? '#e6f1f9' : 'white',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: role === r.key ? '#005a9c' : '#0f172a',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span>{r.label}</span>
                    {role === r.key && <span>✓ Active</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

