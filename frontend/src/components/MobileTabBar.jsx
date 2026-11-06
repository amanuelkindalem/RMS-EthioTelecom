import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  IconDashboard,
  IconFuel,
  IconCheckCircle,
  IconDollarSign,
  IconBarChart,
  IconAlertTriangle,
} from './Icons';

export const MobileTabBar = ({ activeTab, onSelectTab, pendingCount = 0, fraudCount = 0 }) => {
  const { role } = useAuth();

  // Tab definitions
  const tabs = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: IconDashboard,
    },
    {
      id: 'driver-app',
      label: 'Driver',
      icon: IconFuel,
    },
    {
      id: 'fuel-sessions',
      label: 'Sessions',
      icon: IconFuel,
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: IconCheckCircle,
      badge: pendingCount,
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: IconDollarSign,
    },
    {
      id: 'reports',
      label: 'More',
      icon: IconBarChart,
      badge: fraudCount,
    },
  ];

  return (
    <nav className="mobile-tab-bar">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <div
            key={tab.id}
            className={`tab-bar-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
          >
            {tab.badge > 0 && <span className="tab-badge">{tab.badge}</span>}
            <IconComponent size={20} />
            <span className="tab-bar-label">{tab.label}</span>
          </div>
        );
      })}
    </nav>
  );
};

