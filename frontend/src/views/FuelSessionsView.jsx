import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { IconPlus, IconFuel, IconClock, IconAlertTriangle } from '../components/Icons';

export const FuelSessionsView = ({
  sessions = [],
  branches = [],
  vehicles = [],
  drivers = [],
  onCreateSession,
  onRecordInitial,
  onRecordMetadata,
  onCloseSession,
}) => {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState('ALL');
  const [selectedSession, setSelectedSession] = useState(null);

  // Bottom Sheets
  const [showOpenSheet, setShowOpenSheet] = useState(false);
  const [showInitialSheet, setShowInitialSheet] = useState(false);
  const [showMetadataSheet, setShowMetadataSheet] = useState(false);
  const [showCloseSheet, setShowCloseSheet] = useState(false);

  // Form States
  const [openForm, setOpenForm] = useState({
    branchId: branches[0]?.id || '',
    vehicleId: vehicles[0]?.id || '',
    driverId: drivers[0]?.id || '',
    erpTaskRef: `ERD-TASK-2025-${Math.floor(1000 + Math.random() * 9000)}`,
  });

  const [initialForm, setInitialForm] = useState({
    odometer: 120000,
    fuelLevel: 50,
  });

  const [metadataForm, setMetadataForm] = useState({
    departure: 'HQ Depot Yard',
    destination: 'Bole Substation 04',
    requestedDepartment: 'Mobile Infrastructure',
    description: 'Routine maintenance & generator diesel inspection',
    timeOut: new Date().toISOString().slice(0, 16),
  });

  const [closeForm, setCloseForm] = useState({
    odometerEnd: 120250,
    fuelLevelEnd: 20,
  });

  const canManage = role === 'REFUELING_TEAM' || role === 'HQ_ADMIN';

  const filteredSessions = sessions.filter((s) => {
    if (activeTab === 'OPEN') return s.status === 'OPEN';
    if (activeTab === 'CLOSED') return s.status === 'CLOSED';
    return true;
  });

  const handleOpenSubmit = (e) => {
    e.preventDefault();
    onCreateSession(openForm);
    setShowOpenSheet(false);
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!selectedSession) return;
    onRecordInitial(selectedSession.id, {
      odometer: Number(initialForm.odometer),
      fuelLevel: Number(initialForm.fuelLevel),
    });
    setShowInitialSheet(false);
  };

  const handleMetadataSubmit = (e) => {
    e.preventDefault();
    if (!selectedSession) return;
    onRecordMetadata(selectedSession.id, {
      ...metadataForm,
      timeOut: new Date(metadataForm.timeOut).toISOString(),
    });
    setShowMetadataSheet(false);
  };

  const handleCloseSubmit = (e) => {
    e.preventDefault();
    if (!selectedSession) return;
    onCloseSession(selectedSession.id, {
      odometerEnd: Number(closeForm.odometerEnd),
      fuelLevelEnd: Number(closeForm.fuelLevelEnd),
    });
    setShowCloseSheet(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Fuel Sessions</h2>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Trip dispatch & automated audits</p>
        </div>

        {canManage && (
          <button
            onClick={() => setShowOpenSheet(true)}
            className="btn-mobile btn-mobile-sm btn-mobile-primary"
          >
            <IconPlus size={14} />
            <span>Open Session</span>
          </button>
        )}
      </div>

      {/* Segmented Control Filter */}
      <div className="segmented-control">
        <button
          className={`segment-btn ${activeTab === 'ALL' ? 'active' : ''}`}
          onClick={() => setActiveTab('ALL')}
        >
          All ({sessions.length})
        </button>
        <button
          className={`segment-btn ${activeTab === 'OPEN' ? 'active' : ''}`}
          onClick={() => setActiveTab('OPEN')}
        >
          Active ({sessions.filter((s) => s.status === 'OPEN').length})
        </button>
        <button
          className={`segment-btn ${activeTab === 'CLOSED' ? 'active' : ''}`}
          onClick={() => setActiveTab('CLOSED')}
        >
          Closed ({sessions.filter((s) => s.status === 'CLOSED').length})
        </button>
      </div>

      {/* Mobile Session Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredSessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8', fontSize: '0.9rem' }}>
            No sessions match this filter.
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div key={session.id} className="mobile-card" style={{ marginBottom: 0 }}>
              <div className="mobile-card-header">
                <div>
                  <span style={{ fontWeight: 800, color: '#005a9c', fontSize: '0.95rem' }}>
                    {session.erpTaskRef}
                  </span>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    Opened: {new Date(session.openedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <StatusBadge status={session.status} />
              </div>

              <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', margin: '8px 0', border: '1px solid #edf2f7' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Vehicle:</span>
                  <strong>{session.vehicle?.vehicleCode || 'ET Fleet'} ({session.vehicle?.capacityLiters || 80}L)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
                  <span style={{ color: '#64748b' }}>Driver:</span>
                  <strong>{session.driver?.fullName || 'Assigned Driver'}</strong>
                </div>
              </div>

              {session.initialState ? (
                <div style={{ display: 'flex', justifyContent: 'space-around', background: '#f1f5f9', padding: '8px', borderRadius: '8px', fontSize: '0.78rem', marginBottom: '8px' }}>
                  <div><strong>Odo Start:</strong> {session.initialState.odometerStart.toLocaleString()} km</div>
                  <div><strong>Fuel Start:</strong> {session.initialState.fuelLevelStart} L</div>
                </div>
              ) : (
                <div style={{ color: '#d97706', fontSize: '0.75rem', fontWeight: 700, margin: '6px 0' }}>
                  ⚠ Initial vehicle reading not yet captured
                </div>
              )}

              {session.metadata && (
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '8px' }}>
                  Route: <strong>{session.metadata.departure}</strong> ➜ <strong>{session.metadata.destination}</strong>
                </div>
              )}

              {session.analysis && (
                <div style={{ background: session.analysis.flagged ? '#fee2e2' : '#f0fdf4', padding: '8px 10px', borderRadius: '8px', fontSize: '0.75rem', color: session.analysis.flagged ? '#991b1b' : '#166534', marginBottom: '8px' }}>
                  <div>Dist: <strong>{session.analysis.distance} km</strong> | Expected: {session.analysis.expectedConsumption?.toFixed(1)} L | Actual: {session.analysis.actualConsumption?.toFixed(1)} L</div>
                  <div style={{ fontWeight: 800, marginTop: '2px' }}>
                    Variance: {session.analysis.variance?.toFixed(1)} L {session.analysis.flagged && '⚠ EXCEEDS 10% MARGIN'}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {canManage && session.status === 'OPEN' && (
                <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                  {!session.initialState && (
                    <button
                      onClick={() => {
                        setSelectedSession(session);
                        setShowInitialSheet(true);
                      }}
                      className="btn-mobile btn-mobile-sm btn-mobile-primary"
                    >
                      Record Start
                    </button>
                  )}

                  {!session.metadata && (
                    <button
                      onClick={() => {
                        setSelectedSession(session);
                        setShowMetadataSheet(true);
                      }}
                      className="btn-mobile btn-mobile-sm btn-mobile-outline"
                    >
                      Add Route
                    </button>
                  )}

                  {session.initialState && (
                    <button
                      onClick={() => {
                        setSelectedSession(session);
                        setCloseForm({
                          odometerEnd: session.initialState.odometerStart + 150,
                          fuelLevelEnd: Math.max(0, session.initialState.fuelLevelStart - 20),
                        });
                        setShowCloseSheet(true);
                      }}
                      className="btn-mobile btn-mobile-sm btn-mobile-secondary"
                    >
                      Audit & Close
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* BOTTOM SHEET 1: Open Fuel Session (UC 2) */}
      {showOpenSheet && (
        <div className="bottom-sheet-overlay" onClick={() => setShowOpenSheet(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle" />
            <div className="bottom-sheet-header">
              <h3 className="bottom-sheet-title">Open New Fuel Session</h3>
              <button className="btn-mobile btn-mobile-sm btn-mobile-outline" onClick={() => setShowOpenSheet(false)}>✕</button>
            </div>
            <form onSubmit={handleOpenSubmit}>
              <div className="bottom-sheet-body">
                <div className="mobile-input-group">
                  <label className="mobile-input-label">ERD Task Reference Number *</label>
                  <input
                    type="text"
                    required
                    className="mobile-input"
                    value={openForm.erpTaskRef}
                    onChange={(e) => setOpenForm({ ...openForm, erpTaskRef: e.target.value })}
                  />
                </div>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Branch Depot *</label>
                  <select
                    className="mobile-input"
                    value={openForm.branchId}
                    onChange={(e) => setOpenForm({ ...openForm, branchId: e.target.value })}
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Assigned Vehicle *</label>
                  <select
                    className="mobile-input"
                    value={openForm.vehicleId}
                    onChange={(e) => setOpenForm({ ...openForm, vehicleId: e.target.value })}
                  >
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>{v.vehicleCode} - {v.type}</option>
                    ))}
                  </select>
                </div>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Driver *</label>
                  <select
                    className="mobile-input"
                    value={openForm.driverId}
                    onChange={(e) => setOpenForm({ ...openForm, driverId: e.target.value })}
                  >
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>{d.fullName} ({d.employeeId || d.email})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="bottom-sheet-footer">
                <button type="submit" className="btn-mobile btn-mobile-primary">Open Session</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM SHEET 2: Record Initial State (UC 3) */}
      {showInitialSheet && (
        <div className="bottom-sheet-overlay" onClick={() => setShowInitialSheet(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle" />
            <div className="bottom-sheet-header">
              <h3 className="bottom-sheet-title">Record Start Readings (UC 3)</h3>
              <button className="btn-mobile btn-mobile-sm btn-mobile-outline" onClick={() => setShowInitialSheet(false)}>✕</button>
            </div>
            <form onSubmit={handleInitialSubmit}>
              <div className="bottom-sheet-body">
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>
                  Verify vehicle starting condition for <strong>{selectedSession?.erpTaskRef}</strong>.
                </p>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Odometer Reading Start (km) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="mobile-input"
                    value={initialForm.odometer}
                    onChange={(e) => setInitialForm({ ...initialForm, odometer: e.target.value })}
                  />
                </div>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Fuel Level Start (Liters) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="500"
                    className="mobile-input"
                    value={initialForm.fuelLevel}
                    onChange={(e) => setInitialForm({ ...initialForm, fuelLevel: e.target.value })}
                  />
                </div>
              </div>
              <div className="bottom-sheet-footer">
                <button type="submit" className="btn-mobile btn-mobile-primary">Lock Start Readings</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM SHEET 3: Record Metadata (UC 4) */}
      {showMetadataSheet && (
        <div className="bottom-sheet-overlay" onClick={() => setShowMetadataSheet(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle" />
            <div className="bottom-sheet-header">
              <h3 className="bottom-sheet-title">Trip Route & Purpose (UC 4)</h3>
              <button className="btn-mobile btn-mobile-sm btn-mobile-outline" onClick={() => setShowMetadataSheet(false)}>✕</button>
            </div>
            <form onSubmit={handleMetadataSubmit}>
              <div className="bottom-sheet-body">
                <div className="mobile-input-group">
                  <label className="mobile-input-label">Departure Yard *</label>
                  <input
                    type="text"
                    required
                    className="mobile-input"
                    value={metadataForm.departure}
                    onChange={(e) => setMetadataForm({ ...metadataForm, departure: e.target.value })}
                  />
                </div>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Destination Location *</label>
                  <input
                    type="text"
                    required
                    className="mobile-input"
                    value={metadataForm.destination}
                    onChange={(e) => setMetadataForm({ ...metadataForm, destination: e.target.value })}
                  />
                </div>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Department *</label>
                  <input
                    type="text"
                    required
                    className="mobile-input"
                    value={metadataForm.requestedDepartment}
                    onChange={(e) => setMetadataForm({ ...metadataForm, requestedDepartment: e.target.value })}
                  />
                </div>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Departure Time *</label>
                  <input
                    type="datetime-local"
                    required
                    className="mobile-input"
                    value={metadataForm.timeOut}
                    onChange={(e) => setMetadataForm({ ...metadataForm, timeOut: e.target.value })}
                  />
                </div>
              </div>
              <div className="bottom-sheet-footer">
                <button type="submit" className="btn-mobile btn-mobile-primary">Save Route</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM SHEET 4: Close & Audit (UC 8 & 9) */}
      {showCloseSheet && (
        <div className="bottom-sheet-overlay" onClick={() => setShowCloseSheet(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle" />
            <div className="bottom-sheet-header">
              <h3 className="bottom-sheet-title">Close & Audit Session</h3>
              <button className="btn-mobile btn-mobile-sm btn-mobile-outline" onClick={() => setShowCloseSheet(false)}>✕</button>
            </div>
            <form onSubmit={handleCloseSubmit}>
              <div className="bottom-sheet-body">
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '14px' }}>
                  Enter return readings. System automatically computes consumption variance against <strong>{selectedSession?.vehicle?.standardConsumption || 0.12} L/km</strong>.
                </p>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Final Odometer (km) *</label>
                  <input
                    type="number"
                    required
                    min={selectedSession?.initialState?.odometerStart || 0}
                    className="mobile-input"
                    value={closeForm.odometerEnd}
                    onChange={(e) => setCloseForm({ ...closeForm, odometerEnd: e.target.value })}
                  />
                </div>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Final Fuel Level (Liters) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    className="mobile-input"
                    value={closeForm.fuelLevelEnd}
                    onChange={(e) => setCloseForm({ ...closeForm, fuelLevelEnd: e.target.value })}
                  />
                </div>
              </div>
              <div className="bottom-sheet-footer">
                <button type="submit" className="btn-mobile btn-mobile-secondary">Perform Audit & Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
