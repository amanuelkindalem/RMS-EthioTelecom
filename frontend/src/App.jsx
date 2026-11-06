import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OfflineProvider, useOffline } from './context/OfflineContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Dedicated Driver Mobile App
import { DriverMobileApp } from './views/DriverMobileApp';

// Operations Web Dashboard Views
import { DashboardView } from './views/DashboardView';
import { FuelSessionsView } from './views/FuelSessionsView';
import { ManagerApprovalView } from './views/ManagerApprovalView';
import { FinanceView } from './views/FinanceView';
import { FraudAlertsView } from './views/FraudAlertsView';
import { UsersView } from './views/UsersView';
import { BranchesView } from './views/BranchesView';
import { VehiclesView } from './views/VehiclesView';
import { ReportsView } from './views/ReportsView';

// APIs & Mock Seeds
import {
  INITIAL_BRANCHES,
  INITIAL_VEHICLES,
  INITIAL_USERS,
  INITIAL_SESSIONS,
} from './api/mockData';
import {
  userApi,
  branchApi,
  vehicleApi,
  fuelSessionApi,
  financeApi,
  reportsApi,
} from './api/client';

const MainLayout = () => {
  const { role, user, switchRole } = useAuth();
  const { syncQueue } = useOffline();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);

  // Core Data Collections
  const [branches, setBranches] = useState(INITIAL_BRANCHES);
  const [vehicles, setVehicles] = useState(INITIAL_VEHICLES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);

  const [requests, setRequests] = useState([
    {
      id: 'fr-201',
      fuelSessionId: 'fs-101',
      requestedById: 'Tewodros Kassaye',
      requestedAmount: 40,
      approvedAmount: 40,
      status: 'APPROVED',
      managerComment: 'Approved for Bole Tower route.',
      createdAt: '2026-11-06T08:15:00Z',
    },
    {
      id: 'fr-202',
      fuelSessionId: 'fs-101',
      requestedById: 'Tewodros Kassaye',
      requestedAmount: 35,
      approvedAmount: null,
      status: 'PENDING',
      justification: 'Additional mileage for backup generator inspection.',
      createdAt: new Date().toISOString(),
    },
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 'ft-301',
      fuelRequestId: 'fr-201',
      amount: 4220,
      paymentMethod: 'Telebirr Business Fuel Voucher',
      reference: 'TX-ET-994821',
      paidAt: '2026-11-06T08:30:00Z',
    },
  ]);

  const [fraudCases, setFraudCases] = useState([
    {
      id: 'fc-401',
      fuelSessionId: 'fs-102',
      reason: 'Fuel consumption variance of +14.6 L exceeds allowed 10% threshold for vehicle ET-3-89201',
      resolved: false,
      resolutionNote: null,
      createdAt: '2026-11-05T17:30:00Z',
    },
  ]);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Try fetching live backend data if available
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const [bData, vData, uData] = await Promise.allSettled([
          branchApi.getBranches(),
          vehicleApi.getVehicles(),
          userApi.getUsers(),
        ]);

        if (bData.status === 'fulfilled' && Array.isArray(bData.value) && bData.value.length > 0) {
          setBranches(bData.value);
        }
        if (vData.status === 'fulfilled' && Array.isArray(vData.value) && vData.value.length > 0) {
          setVehicles(vData.value);
        }
        if (uData.status === 'fulfilled' && Array.isArray(uData.value) && uData.value.length > 0) {
          setUsers(uData.value);
        }
      } catch (e) {}
    };

    fetchBackendData();
  }, []);

  // Action Handlers
  const handleCreateUser = async (data) => {
    try {
      const created = await userApi.createUser(data);
      setUsers((prev) => [created, ...prev]);
    } catch (err) {
      const mockUser = { id: `u-${Date.now()}`, ...data, isActive: true };
      setUsers((prev) => [mockUser, ...prev]);
    }
    showToast(`User account created for ${data.fullName}`);
  };

  const handleDeactivateUser = async (id) => {
    try {
      await userApi.deactivateUser(id);
    } catch (e) {}
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, isActive: false } : u))
    );
    showToast('User has been deactivated.');
  };

  const handleCreateBranch = async (data) => {
    try {
      const created = await branchApi.createBranch(data);
      setBranches((prev) => [...prev, created]);
    } catch (e) {
      setBranches((prev) => [...prev, { id: `b-${Date.now()}`, ...data }]);
    }
    showToast(`Branch ${data.name} registered.`);
  };

  const handleCreateVehicle = async (data) => {
    try {
      const created = await vehicleApi.createVehicle(data);
      setVehicles((prev) => [...prev, created]);
    } catch (e) {
      setVehicles((prev) => [...prev, { id: `v-${Date.now()}`, ...data }]);
    }
    showToast(`Vehicle ${data.vehicleCode} added to fleet.`);
  };

  const handleCreateSession = async (data) => {
    try {
      const created = await fuelSessionApi.createSession(data);
      setSessions((prev) => [created, ...prev]);
    } catch (e) {
      const v = vehicles.find((item) => item.id === data.vehicleId);
      const d = users.find((item) => item.id === data.driverId);
      const b = branches.find((item) => item.id === data.branchId);

      const mockSession = {
        id: `fs-${Date.now()}`,
        ...data,
        status: 'OPEN',
        openedAt: new Date().toISOString(),
        vehicle: v,
        driver: d,
        branch: b,
        fuelRequests: [],
      };
      setSessions((prev) => [mockSession, ...prev]);
    }
    showToast(`Fuel session opened for task ${data.erpTaskRef}`);
  };

  const handleRecordInitial = async (sessionId, data) => {
    try {
      await fuelSessionApi.recordInitialState(sessionId, data);
    } catch (e) {}

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              initialState: {
                odometerStart: data.odometer,
                fuelLevelStart: data.fuelLevel,
                recordedAt: new Date().toISOString(),
              },
            }
          : s
      )
    );
    showToast('Initial readings locked.');
  };

  const handleRecordMetadata = async (sessionId, data) => {
    try {
      await fuelSessionApi.createMetadata(sessionId, data);
    } catch (e) {}

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              metadata: {
                departure: data.departure,
                destination: data.destination,
                department: data.requestedDepartment,
                description: data.description,
                timeOut: data.timeOut,
              },
            }
          : s
      )
    );
    showToast('Trip route saved.');
  };

  const handleCloseSession = async (sessionId, { odometerEnd, fuelLevelEnd }) => {
    const session = sessions.find((s) => s.id === sessionId);
    if (!session || !session.initialState) return;

    try {
      await fuelSessionApi.closeSession(sessionId);
    } catch (e) {}

    const distance = odometerEnd - session.initialState.odometerStart;
    const standardRate = session.vehicle?.standardConsumption || 0.12;
    const expectedConsumption = distance * standardRate;
    const actualConsumption = session.initialState.fuelLevelStart - fuelLevelEnd;
    const variance = actualConsumption - expectedConsumption;
    const flagged = Math.abs(variance) > expectedConsumption * 0.1;

    const analysis = {
      distance,
      expectedConsumption,
      actualConsumption,
      variance,
      flagged,
    };

    if (flagged) {
      const newFraudCase = {
        id: `fc-${Date.now()}`,
        fuelSessionId: sessionId,
        reason: `Consumption variance of +${variance.toFixed(1)} L exceeds 10% tolerance for vehicle ${session.vehicle?.vehicleCode}`,
        resolved: false,
        resolutionNote: null,
        createdAt: new Date().toISOString(),
      };
      setFraudCases((prev) => [newFraudCase, ...prev]);
      showToast(`⚠ Session closed with ${variance.toFixed(1)}L discrepancy! Flagged for investigation.`, 'error');
    } else {
      showToast(`Session closed & audited: Distance ${distance} km, Normal consumption.`);
    }

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              status: flagged ? 'FLAGGED' : 'CLOSED',
              closedAt: new Date().toISOString(),
              finalState: {
                odometerEnd,
                fuelLevelEnd,
                recordedAt: new Date().toISOString(),
              },
              analysis,
            }
          : s
      )
    );
  };

  const handleSubmitFuelRequest = async (sessionId, amount, justification) => {
    try {
      await fuelSessionApi.requestFuel(sessionId, amount);
    } catch (e) {}

    const newReq = {
      id: `fr-${Date.now()}`,
      fuelSessionId: sessionId,
      requestedById: user?.fullName || 'Driver',
      requestedAmount: amount,
      approvedAmount: null,
      status: 'PENDING',
      justification,
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newReq, ...prev]);
    showToast(`Request for ${amount}L sent to Refuel Manager.`);
  };

  const handleApproveRequest = async (requestId, approvedAmount, comment) => {
    try {
      await fuelSessionApi.approveRequest(requestId, approvedAmount, comment);
    } catch (e) {}

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'APPROVED',
              approvedAmount,
              managerComment: comment,
            }
          : r
      )
    );
    showToast(`Request authorized for ${approvedAmount}L. Forwarded to Finance.`);
  };

  const handleRejectRequest = async (requestId, comment) => {
    try {
      await fuelSessionApi.rejectRequest(requestId, comment);
    } catch (e) {}

    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: 'REJECTED',
              managerComment: comment,
            }
          : r
      )
    );
    showToast('Fuel request rejected.');
  };

  const handleProcessDisbursement = async (data) => {
    try {
      await financeApi.createTransaction(user.id, data);
    } catch (e) {}

    const newTx = {
      id: `ft-${Date.now()}`,
      fuelRequestId: data.fuelRequestId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      reference: data.reference,
      paidAt: new Date().toISOString(),
    };

    setTransactions((prev) => [newTx, ...prev]);
    setRequests((prev) =>
      prev.map((r) =>
        r.id === data.fuelRequestId ? { ...r, transaction: newTx } : r
      )
    );

    showToast(`Disbursement of ${data.amount.toLocaleString()} ETB released via ${data.paymentMethod}.`);
  };

  const handleResolveCase = (caseId, resolutionNote) => {
    setFraudCases((prev) =>
      prev.map((c) =>
        c.id === caseId ? { ...c, resolved: true, resolutionNote } : c
      )
    );
    showToast('Investigation concluded and resolution notes logged.');
  };

  const driversList = users.filter((u) => u.role === 'DRIVER');

  // =========================================================
  // 1. DRIVER-ONLY MOBILE APP EXPERIENCE
  // If user role is DRIVER: Render ONLY the dedicated Driver Mobile App!
  // =========================================================
  if (role === 'DRIVER') {
    return (
      <DriverMobileApp
        sessions={sessions}
        requests={requests}
        onSubmitRequest={handleSubmitFuelRequest}
      />
    );
  }

  // =========================================================
  // 2. OPERATIONS & MANAGEMENT WEB DASHBOARD
  // For Refuel Team, Refuel Manager, Finance, Branch Admin, HQ Admin, Fuel Admin
  // =========================================================
  return (
    <div className="dashboard-layout">
      <Sidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      <div className="dashboard-main">
        {/* Top Navbar */}
        <header className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
              EthioTelecom RMS
            </div>
            <span className="badge badge-primary">Operations Desk</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Quick jump to Driver Mobile Experience button */}
            <button
              onClick={() => switchRole('DRIVER')}
              className="mode-switch-pill"
              title="Test the Driver Mobile Application"
            >
              <span>📱 Open Driver Mobile App</span>
            </button>

            {/* Active User Info & Role Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={role}
                onChange={(e) => switchRole(e.target.value)}
                className="form-select"
                style={{ width: 'auto', padding: '6px 12px', fontSize: '0.82rem', fontWeight: 700 }}
              >
                <option value="REFUELING_MANAGER">Refuel Manager</option>
                <option value="REFUELING_TEAM">Refueling Team</option>
                <option value="FINANCE">Finance Team</option>
                <option value="FUEL_ADMIN">Fuel Fleet Admin</option>
                <option value="BRANCH_ADMIN">Branch Admin</option>
                <option value="HQ_ADMIN">HQ Admin</option>
              </select>

              <div style={{ textAlign: 'right', marginLeft: '6px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a' }}>{user?.fullName}</div>
                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{user?.email}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content Body */}
        <main className="dashboard-content">
          {activeTab === 'dashboard' && (
            <DashboardView
              sessions={sessions}
              requests={requests}
              fraudCases={fraudCases}
              vehicles={vehicles}
              onNavigate={setActiveTab}
            />
          )}

          {activeTab === 'fuel-sessions' && (
            <FuelSessionsView
              sessions={sessions}
              branches={branches}
              vehicles={vehicles}
              drivers={driversList.length > 0 ? driversList : users}
              onCreateSession={handleCreateSession}
              onRecordInitial={handleRecordInitial}
              onRecordMetadata={handleRecordMetadata}
              onCloseSession={handleCloseSession}
            />
          )}

          {activeTab === 'approvals' && (
            <ManagerApprovalView
              requests={requests}
              sessions={sessions}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
            />
          )}

          {activeTab === 'finance' && (
            <FinanceView
              approvedRequests={requests}
              transactions={transactions}
              onProcessDisbursement={handleProcessDisbursement}
            />
          )}

          {activeTab === 'fraud' && (
            <FraudAlertsView
              fraudCases={fraudCases}
              sessions={sessions}
              onResolveCase={handleResolveCase}
            />
          )}

          {activeTab === 'users' && (
            <UsersView
              users={users}
              branches={branches}
              onCreateUser={handleCreateUser}
              onDeactivateUser={handleDeactivateUser}
            />
          )}

          {activeTab === 'branches' && (
            <BranchesView
              branches={branches}
              onCreateBranch={handleCreateBranch}
            />
          )}

          {activeTab === 'vehicles' && (
            <VehiclesView
              vehicles={vehicles}
              branches={branches}
              onCreateVehicle={handleCreateVehicle}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              sessions={sessions}
              transactions={transactions}
              fraudCases={fraudCases}
              branches={branches}
              vehicles={vehicles}
            />
          )}
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <OfflineProvider>
        <MainLayout />
      </OfflineProvider>
    </AuthProvider>
  );
}
