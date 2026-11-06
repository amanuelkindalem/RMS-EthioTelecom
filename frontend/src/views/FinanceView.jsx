import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { IconDollarSign, IconCheckCircle, IconFileText } from '../components/Icons';

export const FinanceView = ({
  approvedRequests = [],
  transactions = [],
  onProcessDisbursement,
}) => {
  const { user, role } = useAuth();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [fuelPricePerLiter, setFuelPricePerLiter] = useState(105.5);
  const [paymentMethod, setPaymentMethod] = useState('Telebirr Fuel Merchant');
  const [reference, setReference] = useState('');

  const canDisburse = role === 'FINANCE' || role === 'HQ_ADMIN';

  const unpaidApproved = approvedRequests.filter(
    (req) => req.status === 'APPROVED' && !req.transaction
  );

  const handleOpenDisburse = (req) => {
    setSelectedRequest(req);
    const code = `TX-ET-${Math.floor(100000 + Math.random() * 900000)}`;
    setReference(code);
  };

  const handleDisburseSubmit = (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const liters = selectedRequest.approvedAmount || selectedRequest.requestedAmount;
    const totalCost = Number((liters * fuelPricePerLiter).toFixed(2));

    onProcessDisbursement({
      fuelRequestId: selectedRequest.id,
      amount: totalCost,
      paymentMethod,
      reference,
      liters,
    });

    setSelectedRequest(null);
  };

  const totalDisbursedAmount = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);

  return (
    <div>
      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Financial Disbursements (UC 7)</h2>
        <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Release fuel funds via Telebirr or cash voucher</p>
      </div>

      {/* Payout Metric Card */}
      <div className="fuel-gauge-card" style={{ background: 'linear-gradient(135deg, #15803d, #14532d)' }}>
        <div className="fuel-gauge-title">Total Payout Volume</div>
        <div className="fuel-gauge-val">{totalDisbursedAmount.toLocaleString()} ETB</div>
        <div style={{ fontSize: '0.8rem', color: '#dcfce7', marginTop: '4px' }}>
          {transactions.length} successful disbursements • {unpaidApproved.length} awaiting release
        </div>
      </div>

      {/* Pending Payout Queue */}
      <div style={{ marginBottom: '18px' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
          Approved Requests Awaiting Release ({unpaidApproved.length})
        </h3>

        {unpaidApproved.length === 0 ? (
          <div className="mobile-card" style={{ textAlign: 'center', padding: '24px 16px', color: '#64748b' }}>
            ✓ No unpaid fuel requests. All released!
          </div>
        ) : (
          unpaidApproved.map((req) => {
            const liters = req.approvedAmount || req.requestedAmount;
            const estimated = (liters * fuelPricePerLiter).toFixed(2);
            return (
              <div key={req.id} className="mobile-card" style={{ marginBottom: '10px' }}>
                <div className="mobile-card-header">
                  <div>
                    <span style={{ fontWeight: 800, color: '#005a9c' }}>{req.id}</span>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Session: {req.fuelSessionId}</div>
                  </div>
                  <span className="badge badge-success">Approved</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '12px', borderRadius: '12px', margin: '8px 0' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Approved Liters</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900 }}>{liters} L</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Disbursement Total</div>
                    <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#16a34a' }}>
                      {Number(estimated).toLocaleString()} ETB
                    </div>
                  </div>
                </div>

                {canDisburse && (
                  <button
                    onClick={() => handleOpenDisburse(req)}
                    className="btn-mobile btn-mobile-primary"
                    style={{ marginTop: '8px', padding: '10px' }}
                  >
                    <IconDollarSign size={16} />
                    <span>Disburse via Telebirr</span>
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Completed Ledger */}
      <div>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '8px' }}>
          Recent Telebirr / Cash Vouchers
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {transactions.map((tx) => (
            <div
              key={tx.id}
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
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#005a9c', fontSize: '0.85rem' }}>
                  {tx.reference}
                </span>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {tx.paymentMethod} • {new Date(tx.paidAt || Date.now()).toLocaleDateString()}
                </div>
              </div>
              <div style={{ fontWeight: 800, color: '#16a34a', fontSize: '1rem' }}>
                +{tx.amount.toLocaleString()} ETB
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOTTOM SHEET: Confirm Disbursement */}
      {selectedRequest && (
        <div className="bottom-sheet-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-handle" />
            <div className="bottom-sheet-header">
              <h3 className="bottom-sheet-title">Release Funds (UC 7)</h3>
              <button className="btn-mobile btn-mobile-sm btn-mobile-outline" onClick={() => setSelectedRequest(null)}>✕</button>
            </div>
            <form onSubmit={handleDisburseSubmit}>
              <div className="bottom-sheet-body">
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Fuel Volume:</span>
                    <strong>{selectedRequest.approvedAmount || selectedRequest.requestedAmount} Liters</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                    <span style={{ color: '#64748b' }}>Standard Tariff:</span>
                    <span>{fuelPricePerLiter} ETB / Liter</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900, color: '#16a34a', borderTop: '1px solid #cbd5e1', paddingTop: '6px', marginTop: '6px' }}>
                    <span>Total Cost:</span>
                    <span>
                      {(
                        (selectedRequest.approvedAmount || selectedRequest.requestedAmount) *
                        fuelPricePerLiter
                      ).toLocaleString()}{' '}
                      ETB
                    </span>
                  </div>
                </div>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Payment Channel *</label>
                  <select
                    className="mobile-input"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="Telebirr Business Fuel Voucher">Telebirr Business Fuel Voucher</option>
                    <option value="Electronic Bank Transfer (CBE)">Electronic Bank Transfer (CBE)</option>
                    <option value="Petty Cash Voucher">Petty Cash Voucher</option>
                    <option value="TotalEnergies Corporate Card">TotalEnergies Corporate Card</option>
                  </select>
                </div>

                <div className="mobile-input-group">
                  <label className="mobile-input-label">Transaction Reference Code *</label>
                  <input
                    type="text"
                    required
                    className="mobile-input"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>
              </div>
              <div className="bottom-sheet-footer">
                <button type="submit" className="btn-mobile btn-mobile-primary">
                  Release & Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
