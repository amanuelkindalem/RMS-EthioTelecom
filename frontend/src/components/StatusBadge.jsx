import React from 'react';

export const StatusBadge = ({ status }) => {
  if (!status) return null;

  switch (status.toUpperCase()) {
    case 'OPEN':
      return <span className="badge badge-primary">● Active Session</span>;
    case 'CLOSED':
      return <span className="badge badge-gray">✓ Closed</span>;
    case 'FLAGGED':
      return <span className="badge badge-danger">⚠ Flagged Discrepancy</span>;
    case 'PENDING':
      return <span className="badge badge-warning">⏳ Pending Approval</span>;
    case 'APPROVED':
      return <span className="badge badge-success">✓ Approved</span>;
    case 'REJECTED':
      return <span className="badge badge-danger">✕ Rejected</span>;
    case 'ACTIVE':
      return <span className="badge badge-success">Active</span>;
    case 'INACTIVE':
      return <span className="badge badge-gray">Inactive</span>;
    default:
      return <span className="badge badge-gray">{status}</span>;
  }
};

export const RoleBadge = ({ role }) => {
  if (!role) return null;

  const roleMap = {
    HQ_ADMIN: { label: 'HQ Admin', color: 'badge-primary' },
    BRANCH_ADMIN: { label: 'Branch Admin', color: 'badge-info' },
    REFUELING_TEAM: { label: 'Refuel Team', color: 'badge-success' },
    REFUELING_MANAGER: { label: 'Refuel Manager', color: 'badge-warning' },
    FINANCE: { label: 'Finance Team', color: 'badge-info' },
    FUEL_ADMIN: { label: 'Fuel Fleet Admin', color: 'badge-primary' },
    DRIVER: { label: 'Driver', color: 'badge-gray' },
  };

  const current = roleMap[role] || { label: role, color: 'badge-gray' };
  return <span className={`badge ${current.color}`}>{current.label}</span>;
};

