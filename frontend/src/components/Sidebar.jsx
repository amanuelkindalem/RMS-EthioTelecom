import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  IconDashboard,
  IconUsers,
  IconBuilding,
  IconTruck,
  IconFuel,
  IconCheckCircle,
  IconDollarSign,
  IconAlertTriangle,
  IconBarChart,
} from './Icons';

export const Sidebar = ({ activeTab, onSelectTab }) => {
  const { role } = useAuth();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Overview & KPIs',
      icon: IconDashboard,
      roles: ['HQ_ADMIN', 'BRANCH_ADMIN', 'REFUELING_TEAM', 'REFUELING_MANAGER', 'FINANCE', 'FUEL_ADMIN', 'DRIVER'],
    },
    {
      id: 'driver-app',
      label: 'Driver Fuel Desk',
      icon: IconFuel,
      roles: ['DRIVER', 'HQ_ADMIN'],
    },
    {
      id: 'fuel-sessions',
      label: 'Fuel Sessions',
      icon: IconFuel,
      roles: ['REFUELING_TEAM', 'HQ_ADMIN', 'BRANCH_ADMIN', 'REFUELING_MANAGER', 'FUEL_ADMIN'],
    },
    {
      id: 'approvals',
      label: 'Request Approvals',
      icon: IconCheckCircle,
      roles: ['REFUELING_MANAGER', 'HQ_ADMIN'],
    },
    {
      id: 'finance',
      label: 'Disbursements',
      icon: IconDollarSign,
      roles: ['FINANCE', 'HQ_ADMIN'],
    },
    {
      id: 'fraud',
      label: 'Fraud Alerts',
      icon: IconAlertTriangle,
      roles: ['REFUELING_MANAGER', 'HQ_ADMIN', 'BRANCH_ADMIN'],
    },
    {
      id: 'vehicles',
      label: 'Vehicle Fleet',
      icon: IconTruck,
      roles: ['FUEL_ADMIN', 'HQ_ADMIN', 'BRANCH_ADMIN'],
    },
    {
      id: 'branches',
      label: 'Branches & Depots',
      icon: IconBuilding,
      roles: ['HQ_ADMIN'],
    },
    {
      id: 'users',
      label: 'User Management',
      icon: IconUsers,
      roles: ['HQ_ADMIN', 'BRANCH_ADMIN'],
    },
    {
      id: 'reports',
      label: 'Analytics & Audit',
      icon: IconBarChart,
      roles: ['HQ_ADMIN', 'BRANCH_ADMIN', 'REFUELING_MANAGER', 'FINANCE'],
    },
  ];

  const allowedItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>EthioTelecom RMS</h2>
      </div>

      <nav className="sidebar-nav">
        {allowedItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <div
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onSelectTab(item.id)}
            >
              <IconComponent className="icon" />
              <span>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div>Department of CS</div>
        <div style={{ color: '#7cb342', fontWeight: 600 }}>EthioTelecom • Group 12</div>
      </div>
    </aside>
  );
};

