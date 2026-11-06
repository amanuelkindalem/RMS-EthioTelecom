import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RoleBadge, StatusBadge } from '../components/StatusBadge';
import { IconPlus, IconUsers } from '../components/Icons';

export const UsersView = ({
  users = [],
  branches = [],
  onCreateUser,
  onDeactivateUser,
}) => {
  const { user: currentLoggedUser, role } = useAuth();
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    role: 'DRIVER',
    branchId: branches[0]?.id || '',
    phoneNumber: '+251 9',
    employeeId: 'ET-USR-',
  });

  const isHqAdmin = role === 'HQ_ADMIN';
  const isBranchAdmin = role === 'BRANCH_ADMIN';
  const canCreate = isHqAdmin || isBranchAdmin;

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateUser(form);
    setShowModal(false);
    setForm({
      fullName: '',
      email: '',
      role: isHqAdmin ? 'BRANCH_ADMIN' : 'DRIVER',
      branchId: branches[0]?.id || '',
      phoneNumber: '+251 9',
      employeeId: 'ET-USR-',
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User & Role Directory (UC 1 / FR-1)</h1>
          <p className="page-description">
            Role-Based Access Control (RBAC): provision branch administrators, drivers, and refueling personnel.
          </p>
        </div>

        {canCreate && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <IconPlus size={16} />
            <span>Create New User</span>
          </button>
        )}
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>User & Employee ID</th>
                <th>Assigned Role</th>
                <th>Branch Assignment</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const userBranch = branches.find((b) => b.id === u.branchId);
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#0f172a' }}>{u.fullName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {u.email} • ID: {u.employeeId || 'N/A'}
                      </div>
                    </td>
                    <td>
                      <RoleBadge role={u.role} />
                    </td>
                    <td>
                      {userBranch ? (
                        <div>
                          <div style={{ fontWeight: 600 }}>{userBranch.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{userBranch.code}</div>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>HQ System-Wide</span>
                      )}
                    </td>
                    <td>
                      <div style={{ fontSize: '0.85rem' }}>{u.phoneNumber || 'N/A'}</div>
                    </td>
                    <td>
                      <StatusBadge status={u.isActive !== false ? 'ACTIVE' : 'INACTIVE'} />
                    </td>
                    <td>
                      {canCreate && u.isActive !== false && u.id !== currentLoggedUser.id && (
                        <button
                          onClick={() => onDeactivateUser(u.id)}
                          className="btn btn-sm btn-outline"
                          title="Deactivate User"
                        >
                          Deactivate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal (UC 1) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Create User Account (UC 1)</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abebe Bikila"
                    className="form-control"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">EthioTelecom Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. abebe.b@ethiotelecom.et"
                    className="form-control"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Assigned Role *</label>
                    <select
                      className="form-select"
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value })}
                    >
                      {isHqAdmin ? (
                        <>
                          <option value="BRANCH_ADMIN">Branch Admin</option>
                          <option value="REFUELING_TEAM">Refueling Team</option>
                          <option value="REFUELING_MANAGER">Refuel Manager</option>
                          <option value="FINANCE">Finance Team</option>
                          <option value="FUEL_ADMIN">Fuel Fleet Admin</option>
                          <option value="DRIVER">Driver</option>
                        </>
                      ) : (
                        <>
                          <option value="DRIVER">Driver</option>
                          <option value="REFUELING_TEAM">Refueling Team</option>
                          <option value="REFUELING_MANAGER">Refuel Manager</option>
                          <option value="FINANCE">Finance Team</option>
                          <option value="FUEL_ADMIN">Fuel Fleet Admin</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Branch *</label>
                    <select
                      className="form-select"
                      value={form.branchId}
                      onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Employee ID</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.employeeId}
                      onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.phoneNumber}
                      onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create User Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

