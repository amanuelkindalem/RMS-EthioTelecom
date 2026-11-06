import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconBuilding, IconPlus } from '../components/Icons';

export const BranchesView = ({ branches = [], onCreateBranch }) => {
  const { role } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    code: '',
    region: 'Addis Ababa',
    zone: 'East Zone',
    woreda: 'Woreda 03',
    kebele: '05',
  });

  const canCreate = role === 'HQ_ADMIN';

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateBranch(form);
    setShowModal(false);
    setForm({
      name: '',
      code: '',
      region: 'Addis Ababa',
      zone: 'East Zone',
      woreda: 'Woreda 03',
      kebele: '05',
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Regional Branches & Depots</h1>
          <p className="page-description">
            EthioTelecom operational centers and regional fleet refueling stations.
          </p>
        </div>

        {canCreate && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <IconPlus size={16} />
            <span>Register Branch</span>
          </button>
        )}
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Branch Name & Code</th>
                <th>Region</th>
                <th>Zone / District</th>
                <th>Woreda & Kebele</th>
              </tr>
            </thead>
            <tbody>
              {branches.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#005a9c' }}>{b.name}</div>
                    <span className="badge badge-primary">{b.code}</span>
                  </td>
                  <td>{b.region}</td>
                  <td>{b.zone}</td>
                  <td>
                    {b.woreda}, Kebele {b.kebele}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Register New Branch Depot</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Branch Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dire Dawa Regional Depot"
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Unique Branch Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. DD-DEP-01"
                    className="form-control"
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Region *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Zone *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={form.zone}
                      onChange={(e) => setForm({ ...form, zone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Woreda *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={form.woreda}
                      onChange={(e) => setForm({ ...form, woreda: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Kebele *</label>
                    <input
                      type="text"
                      required
                      className="form-control"
                      value={form.kebele}
                      onChange={(e) => setForm({ ...form, kebele: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Branch</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

