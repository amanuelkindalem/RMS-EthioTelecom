import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  IconBarChart,
  IconFuel,
  IconDollarSign,
  IconAlertTriangle,
  IconUsers,
  IconTruck,
  IconBuilding,
} from '../components/Icons';

export const ReportsView = ({
  sessions = [],
  transactions = [],
  fraudCases = [],
  branches = [],
  vehicles = [],
  users = [],
  onNavigate,
}) => {
  const { role } = useAuth();
  const [reportType, setReportType] = useState('BRANCH');

  const totalFuelApproved = sessions.reduce((acc, s) => {
    const sessionFuel = s.fuelRequests?.reduce((rAcc, r) => rAcc + (r.approvedAmount || 0), 0) || 0;
    return acc + sessionFuel;
  }, 0);

  const totalDisbursedETB = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);
  const openFraud = fraudCases.filter((f) => !f.resolved);

  return (
    <div>
      <div style={{ marginBottom: '14px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Management & Analytics</h2>
        <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Reports, administrative desk & fraud audits</p>
      </div>

      {/* Admin Quick Launchers on Mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
        <div
          onClick={() => onNavigate('users')}
          className="mobile-card"
          style={{ padding: '12px 8px', textAlign: 'center', marginBottom: 0, cursor: 'pointer' }}
        >
          <div style={{ color: '#005a9c', display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
            <IconUsers size={22} />
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>Users ({users.length})</div>
        </div>

        <div
          onClick={() => onNavigate('vehicles')}
          className="mobile-card"
          style={{ padding: '12px 8px', textAlign: 'center', marginBottom: 0, cursor: 'pointer' }}
        >
          <div style={{ color: '#16a34a', display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
            <IconTruck size={22} />
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>Fleet ({vehicles.length})</div>
        </div>

        <div
          onClick={() => onNavigate('fraud')}
          className="mobile-card"
          style={{ padding: '12px 8px', textAlign: 'center', marginBottom: 0, cursor: 'pointer' }}
        >
          <div style={{ color: '#dc2626', display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
            <IconAlertTriangle size={22} />
          </div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>Fraud ({openFraud.length})</div>
        </div>
      </div>

      {/* Segmented Filter */}
      <div className="segmented-control">
        <button
          className={`segment-btn ${reportType === 'BRANCH' ? 'active' : ''}`}
          onClick={() => setReportType('BRANCH')}
        >
          Branch
        </button>
        <button
          className={`segment-btn ${reportType === 'VEHICLE' ? 'active' : ''}`}
          onClick={() => setReportType('VEHICLE')}
        >
          Fleet
        </button>
        <button
          className={`segment-btn ${reportType === 'FINANCE' ? 'active' : ''}`}
          onClick={() => setReportType('FINANCE')}
        >
          Payouts
        </button>
        <button
          className={`segment-btn ${reportType === 'FRAUD' ? 'active' : ''}`}
          onClick={() => setReportType('FRAUD')}
        >
          Alerts
        </button>
      </div>

      {/* REPORT CONTENT */}
      {reportType === 'BRANCH' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {branches.map((b) => {
            const bSessions = sessions.filter((s) => s.branchId === b.id);
            return (
              <div key={b.id} className="mobile-card">
                <div className="mobile-card-header">
                  <div>
                    <span style={{ fontWeight: 800, color: '#005a9c' }}>{b.name}</span>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      {b.code} • {b.region}
                    </div>
                  </div>
                  <span className="badge badge-primary">{bSessions.length} Trips</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '4px' }}>
                  Zone: {b.zone} • {b.woreda}, Kebele {b.kebele}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reportType === 'VEHICLE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {vehicles.map((v) => {
            const vSessions = sessions.filter((s) => s.vehicleId === v.id && s.analysis);
            const totalDistance = vSessions.reduce((acc, s) => acc + (s.analysis?.distance || 0), 0);
            return (
              <div key={v.id} className="mobile-card">
                <div className="mobile-card-header">
                  <span style={{ fontWeight: 800, color: '#005a9c' }}>{v.vehicleCode}</span>
                  <span className="badge badge-info">{v.standardConsumption} L/km</span>
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{v.type}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginTop: '6px' }}>
                  <span>Tank: {v.capacityLiters} L</span>
                  <span>Recorded: {totalDistance} km</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reportType === 'FINANCE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="fuel-gauge-card" style={{ padding: '14px', marginBottom: '8px' }}>
            <div className="fuel-gauge-title">Aggregated Disbursements</div>
            <div className="fuel-gauge-val">{totalDisbursedETB.toLocaleString()} ETB</div>
          </div>
          {transactions.map((tx) => (
            <div key={tx.id} className="mobile-card">
              <div className="mobile-card-header">
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#005a9c' }}>{tx.reference}</span>
                <span style={{ fontWeight: 800, color: '#16a34a' }}>{tx.amount.toLocaleString()} ETB</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {tx.paymentMethod} • {new Date(tx.paidAt || Date.now()).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {reportType === 'FRAUD' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {fraudCases.map((fc) => (
            <div key={fc.id} className="mobile-card" style={{ borderLeft: '4px solid #dc2626' }}>
              <div className="mobile-card-header">
                <span style={{ fontWeight: 800, color: '#dc2626' }}>{fc.id}</span>
                <StatusBadge status={fc.resolved ? 'APPROVED' : 'FLAGGED'} />
              </div>
              <div style={{ fontSize: '0.82rem', color: '#991b1b', margin: '4px 0' }}>{fc.reason}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {fc.resolutionNote || 'Investigation pending manager review.'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
