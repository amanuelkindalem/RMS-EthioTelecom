import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { IconCheckCircle, IconXCircle, IconFuel } from '../components/Icons';

export const ManagerApprovalView = ({
  requests = [],
  sessions = [],
  onApprove,
  onReject,
}) => {
  const { role } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvedAmount, setApprovedAmount] = useState('');
  const [comment, setComment] = useState('Approved per task itinerary.');
  const [rejectSheet, setRejectSheet] = useState(false);
  const [rejectComment, setRejectComment] = useState('Exceeds standard trip allowance.');

  const canApprove = role === 'REFUELING_MANAGER' || role === 'HQ_ADMIN';

  const pendingList = requests.filter((r) => r.status === 'PENDING');
  const historyList = requests.filter((r) => r.status !== 'PENDING');

  const handleOpenApprove = (req) => {
    setSelectedRequest(req);
    setApprovedAmount(String(req.requestedAmount));
    setComment('Approved for scheduled route.');
  };

  const handleApproveSubmit = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    onApprove(selectedRequest.id, Number(approvedAmount), comment);
    setSelectedRequest(null);
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;
    onReject(selectedRequest.id, rejectComment);
    setRejectSheet(false);
    setSelectedRequest(null);
  };

  return (
    <div>
      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Request Approvals (UC 6)</h2>
        <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Validate driver requests & forward to Finance</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {pendingList.length === 0 ? (
          <div className="mobile-card" style={{ textAlign: 'center', padding: '32px 16px', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✓</div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>All Clear!</div>
            <p style={{ fontSize: '0.82rem', marginTop: '4px' }}>No fuel requests awaiting manager review.</p>
          </div>
        ) : (
          pendingList.map((req) => {
            const parentSession = sessions.find((s) => s.id === req.fuelSessionId);
            return (
              <div key={req.id} className="mobile-card">
                <div className="mobile-card-header">
                  <div>
                    <span style={{ fontWeight: 800, color: '#005a9c', fontSize: '0.95rem' }}>
                      {parentSession?.erpTaskRef || 'Session ID: ' + req.fuelSessionId}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Driver: {req.requestedById || parentSession?.driver?.fullName || 'Assigned Driver'}
                    </div>
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px', borderRadius: '12px', margin: '8px 0', border: '1px solid #edf2f7' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>Requested Volume</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a' }}>
                      {req.requestedAmount} <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>L</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Vehicle Model</div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                      {parentSession?.vehicle?.vehicleCode || 'ET Fleet'}
                    </div>
                  </div>
                </div>

                {req.justification && (
                  <div style={{ fontSize: '0.78rem', color: '#475569', fontStyle: 'italic', marginBottom: '10px' }}>
                    "{req.justification}"
                  </div>
                )}

                {canApprove && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button
                      onClick={() => handleOpenApprove(req)}
                      className="btn-mobile btn-mobile-sm btn-mobile-primary"
                      style={{ flex: 1 }}
                    >
                      <IconCheckCircle size={15} />
                      <span>Authorize</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRequest(req);
                        setRejectSheet(true);
                      }}
                      className="btn-mobile btn-mobile-sm btn-mobile-danger"
                      style={{ flex: 1 }}
                    >
                      <IconXCircle size={15} />
                      <span>Reject</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* History */}
      {historyList.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>
            Decision History
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {historyList.map((req) => (
              <div
                key={req.id}
                style={{
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                    {req.requestedAmount}L ➜ Approved: {req.approvedAmount || 0}L
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    {req.managerComment || 'No comments'}
                  </div>
                </div>
                <StatusBadge status={req.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM SHEET: Authorize / Partial Approval */}
      {selectedRequest && !rejectSheet && (
        <div className="bottom-sheet-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle" />
            <div className="bottom-sheet-header">
              <h3 className="bottom-sheet-title">Authorize Disbursement (UC 6)</h3>
              <button className="btn-mobile btn-mobile-sm btn-mobile-outline" onClick={() => setSelectedRequest(null)}>✕</button>
            </div>
            <form onSubmit={handleApproveSubmit}>
              <div className="bottom-sheet-body">
                <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px' }}>
                  Driver requested <strong>{selectedRequest.requestedAmount} Liters</strong>. You can adjust the approved volume below.
                </p>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Approved Volume (Liters) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={selectedRequest.requestedAmount * 1.5}
                    className="mobile-input"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                  />
                </div>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Manager Verification Note *</label>
                  <input
                    type="text"
                    required
                    className="mobile-input"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>
              </div>
              <div className="bottom-sheet-footer">
                <button type="submit" className="btn-mobile btn-mobile-primary">
                  Confirm & Forward to Finance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOTTOM SHEET: Reject */}
      {rejectSheet && (
        <div className="bottom-sheet-overlay" onClick={() => setRejectSheet(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle" />
            <div className="bottom-sheet-header">
              <h3 className="bottom-sheet-title">Reject Request</h3>
              <button className="btn-mobile btn-mobile-sm btn-mobile-outline" onClick={() => setRejectSheet(false)}>✕</button>
            </div>
            <form onSubmit={handleRejectSubmit}>
              <div className="bottom-sheet-body">
                <div className="mobile-input-group">
                  <label className="mobile-input-label">Rejection Reason *</label>
                  <textarea
                    rows="3"
                    required
                    className="mobile-input"
                    value={rejectComment}
                    onChange={(e) => setRejectComment(e.target.value)}
                  />
                </div>
              </div>
              <div className="bottom-sheet-footer">
                <button type="submit" className="btn-mobile btn-mobile-danger">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
