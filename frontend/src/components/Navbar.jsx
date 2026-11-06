import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';
import { RoleBadge } from './StatusBadge';
import { IconWifi, IconWifiOff, IconRefreshCw, IconLogOut } from './Icons';

export const Navbar = () => {
  const { user, role, switchRole, logout } = useAuth();
  const { isOnline, toggleSimulation, offlineQueue, syncQueue } = useOffline();

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="logo-badge">ET</div>
        <div>
          <div className="app-title">EthioTelecom RMS</div>
          <div className="app-subtitle">Refueling Management System</div>
        </div>
      </div>

      <div className="navbar-actions">
        {/* Offline / Online indicator & SRS toggle simulation */}
        <button
          onClick={toggleSimulation}
          className={`btn btn-sm btn-outline ${isOnline ? '' : 'btn-danger'}`}
          title="Click to toggle Online/Offline simulation mode (per SRS offline requirement)"
          style={{ gap: '6px' }}
        >
          {isOnline ? (
            <>
              <IconWifi size={14} className="text-success" />
              <span>Online Mode</span>
            </>
          ) : (
            <>
              <IconWifiOff size={14} />
              <span>Offline Mode (Simulated)</span>
            </>
          )}
        </button>

        {/* Offline sync queue notice */}
        {offlineQueue.length > 0 && (
          <button
            onClick={() => syncQueue()}
            className="btn btn-sm btn-secondary"
            title="Sync queued offline fuel requests"
          >
            <IconRefreshCw size={14} />
            <span>Sync ({offlineQueue.length})</span>
          </button>
        )}

        {/* Role Switcher for quick test/demo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Active Role:</label>
          <select
            value={role}
            onChange={(e) => switchRole(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '5px 10px', fontSize: '0.82rem', fontWeight: 600 }}
          >
            <option value="HQ_ADMIN">HQ Admin</option>
            <option value="BRANCH_ADMIN">Branch Admin</option>
            <option value="REFUELING_TEAM">Refueling Team</option>
            <option value="REFUELING_MANAGER">Refuel Manager</option>
            <option value="FINANCE">Finance Team</option>
            <option value="FUEL_ADMIN">Fuel Fleet Admin</option>
            <option value="DRIVER">Driver (Mobile App)</option>
          </select>
        </div>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{user?.fullName}</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{user?.email}</div>
          </div>
          <RoleBadge role={role} />
        </div>

        <button onClick={logout} className="btn btn-sm btn-outline" title="Log Out">
          <IconLogOut size={16} />
        </button>
      </div>
    </header>
  );
};

