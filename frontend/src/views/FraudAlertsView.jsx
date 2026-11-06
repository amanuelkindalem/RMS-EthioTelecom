import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { IconAlertTriangle, IconCheckCircle, IconFileText } from '../components/Icons';

export const FraudAlertsView = ({
  fraudCases = [],
  sessions = [],
  onResolveCase,
}) => {
  const { role } = useAuth();
  const [selectedCase, setSelectedCase] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const canInvestigate = role === 'REFUELING_MANAGER' || role === 'HQ_ADMIN' || role === 'BRANCH_ADMIN';

  const openCases = fraudCases.filter((c) => !c.resolved);
  const resolvedCases = fraudCases.filter((c) => c.resolved);

  const handleOpenInvestigate = (fc) => {
    setSelectedCase(fc);
    setResolutionNote('Driver interviewed: route detour due to heavy road construction on Hawassa highway. Acceptable.');
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!selectedCase) return;
    onResolveCase(selectedCase.id, resolutionNote);
    setSelectedCase(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fuel Theft & Anomaly Desk (UC 10)</h1>
          <p className="page-description">
            Automated consumption discrepancy detection: audit cases where vehicle fuel burned exceeded standard rating by &gt;10%.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <IconAlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h4>Active Flagged Cases</h4>
            <div className="stat-value">{openCases.length}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <IconCheckCircle size={24} />
          </div>
          <div className="stat-info">
            <h4>Resolved Investigations</h4>
            <div className="stat-value">{resolvedCases.length}</div>
          </div>
        </div>
      </div>

      {/* Active Investigations */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Flagged Fuel Sessions Under Review ({openCases.length})</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Case & ERP Session</th>
                <th>Vehicle & Driver</th>
                <th>Distance & Variance Analysis</th>
                <th>Detection Reason</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {openCases.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                    ✓ No active fraud flags detected. All sessions match vehicle fuel standards.
                  </td>
                </tr>
              ) : (
                openCases.map((c) => {
                  const s = sessions.find((sess) => sess.id === c.fuelSessionId) || c.fuelSession;
                  return (
                    <tr key={c.id}>
                      <td>
                        <div style={{ fontWeight: 700, color: '#dc2626' }}>{c.id}</div>
                        <div style={{ fontSize: '0.8rem', color: '#005a9c', fontWeight: 600 }}>
                          Session: {s?.erpTaskRef || c.fuelSessionId}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{s?.vehicle?.vehicleCode || 'ET Fleet Vehicle'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          Driver: {s?.driver?.fullName || 'Assigned Driver'}
                        </div>
                      </td>
                      <td>
                        {s?.analysis ? (
                          <div>
                            <div>Traveled: <strong>{s.analysis.distance} km</strong></div>
                            <div style={{ color: '#475569', fontSize: '0.78rem' }}>
                              Expected: {s.analysis.expectedConsumption?.toFixed(1)} L | Actual: {s.analysis.actualConsumption?.toFixed(1)} L
                            </div>
                            <div style={{ color: '#dc2626', fontWeight: 700, fontSize: '0.85rem' }}>
                              Variance: +{s.analysis.variance?.toFixed(1)} Liters
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: '#64748b' }}>Analysis pending</span>
                        )}
                      </td>
                      <td style={{ maxWidth: '300px' }}>
                        <span style={{ fontSize: '0.82rem', color: '#b91c1c', fontWeight: 500 }}>
                          {c.reason}
                        </span>
                      </td>
                      <td>
                        {canInvestigate ? (
                          <button
                            onClick={() => handleOpenInvestigate(c)}
                            className="btn btn-sm btn-outline"
                          >
                            Investigate & Resolve
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Manager Only</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resolved History */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Resolved Investigation Records</h3>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Session Ref</th>
                <th>Investigation Findings & Resolution Note</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {resolvedCases.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    No resolved cases yet.
                  </td>
                </tr>
              ) : (
                resolvedCases.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700 }}>{c.id}</td>
                    <td>{c.fuelSessionId}</td>
                    <td style={{ fontSize: '0.85rem', color: '#334155' }}>
                      {c.resolutionNote || 'Investigation finalized by Refuel Manager.'}
                    </td>
                    <td>
                      <span className="badge badge-success">Resolved</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Investigation & Resolution Note */}
      {selectedCase && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Investigation Findings & Resolution (UC 10)</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setSelectedCase(null)}>✕</button>
            </div>
            <form onSubmit={handleResolveSubmit}>
              <div className="modal-body">
                <div style={{ background: '#fee2e2', padding: '14px', borderRadius: '8px', marginBottom: '16px', color: '#991b1b', fontSize: '0.88rem' }}>
                  <strong>Flagged Alert Reason:</strong>
                  <div>{selectedCase.reason}</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Investigation Notes & Action Taken *</label>
                  <textarea
                    rows="4"
                    required
                    className="form-control"
                    placeholder="Document interview with driver, route obstacles, maintenance inspection results, or disciplinary action taken..."
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                  />
                  <small style={{ color: '#64748b' }}>
                    Per EthioTelecom compliance, resolution notes are preserved in the permanent audit trail.
                  </small>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setSelectedCase(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Mark Case as Resolved</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

