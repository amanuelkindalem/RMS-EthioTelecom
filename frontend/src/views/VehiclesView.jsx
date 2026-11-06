import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { IconTruck, IconPlus } from '../components/Icons';

export const VehiclesView = ({
  vehicles = [],
  branches = [],
  onCreateVehicle,
}) => {
  const { role } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    vehicleCode: 'ET-3-',
    type: 'Toyota Hilux 4x4 Maintenance',
    capacityLiters: 80,
    standardConsumption: 0.12,
    branchId: branches[0]?.id || '',
  });

  const canManage = role === 'FUEL_ADMIN' || role === 'HQ_ADMIN';

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateVehicle({
      ...form,
      capacityLiters: Number(form.capacityLiters),
      standardConsumption: Number(form.standardConsumption),
    });
    setShowModal(false);
    setForm({
      vehicleCode: 'ET-3-',
      type: 'Toyota Hilux 4x4 Maintenance',
      capacityLiters: 80,
      standardConsumption: 0.12,
      branchId: branches[0]?.id || '',
    });
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Vehicle Fleet & Fuel Standards</h1>
          <p className="page-description">
            Fleet registry and standard consumption benchmarks (liters per km) used for automated fraud audits.
          </p>
        </div>

        {canManage && (
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <IconPlus size={16} />
            <span>Register Fleet Vehicle</span>
          </button>
        )}
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Vehicle Plate / Code</th>
                <th>Vehicle Model & Mission Type</th>
                <th>Fuel Tank Capacity</th>
                <th>Standard Consumption (L/km)</th>
                <th>Assigned Branch</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => {
                const branch = branches.find((b) => b.id === v.branchId);
                return (
                  <tr key={v.id}>
                    <td>
                      <span style={{ fontWeight: 800, color: '#005a9c', fontSize: '1rem' }}>
                        {v.vehicleCode}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{v.type}</div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700 }}>{v.capacityLiters} Liters</span>
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {v.standardConsumption} L/km
                      </span>
                      <small style={{ color: '#64748b', display: 'block', marginTop: '2px' }}>
                        ~{((1 / v.standardConsumption) || 0).toFixed(1)} km/L
                      </small>
                    </td>
                    <td>
                      {branch ? branch.name : 'Central Depot'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Register Fleet Vehicle</h3>
              <button className="btn btn-sm btn-outline" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Vehicle Plate / Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ET-3-99482"
                    className="form-control"
                    value={form.vehicleCode}
                    onChange={(e) => setForm({ ...form, vehicleCode: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Vehicle Type / Mission *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Isuzu NPR Fiber Repair Truck"
                    className="form-control"
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tank Capacity (Liters) *</label>
                    <input
                      type="number"
                      required
                      min="10"
                      max="1000"
                      className="form-control"
                      value={form.capacityLiters}
                      onChange={(e) => setForm({ ...form, capacityLiters: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Standard Consumption (L/km) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0.01"
                      max="2.0"
                      className="form-control"
                      value={form.standardConsumption}
                      onChange={(e) => setForm({ ...form, standardConsumption: e.target.value })}
                    />
                    <small style={{ color: '#64748b' }}>Benchmark rating for automatic discrepancy alerts.</small>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Assigned Branch Depot *</label>
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
              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

