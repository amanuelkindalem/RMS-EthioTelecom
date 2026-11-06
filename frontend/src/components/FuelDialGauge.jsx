import React from 'react';

export const FuelDialGauge = ({ currentLevel = 45, capacity = 80 }) => {
  const percentage = Math.max(0, Math.min(100, Math.round((currentLevel / capacity) * 100)));

  // SVG Semi-Circle Arc Math
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // Half-circle perimeter
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color based on level
  let gaugeColor = '#7cb342'; // EthioTelecom green
  if (percentage < 20) {
    gaugeColor = '#dc2626'; // Red low fuel alert
  } else if (percentage < 40) {
    gaugeColor = '#d97706'; // Amber warning
  }

  return (
    <div className="fuel-dial-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.5px' }}>
          Fuel Level Telemetry
        </span>
        <span
          className="badge"
          style={{
            background: percentage < 25 ? '#fee2e2' : '#dcfce7',
            color: percentage < 25 ? '#dc2626' : '#15803d',
            fontWeight: 800,
          }}
        >
          {percentage}% Level
        </span>
      </div>

      <div className="svg-gauge-wrapper">
        <svg width="220" height="130" viewBox="0 0 200 120">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="40%" stopColor="#d97706" />
              <stop offset="70%" stopColor="#7cb342" />
              <stop offset="100%" stopColor="#005a9c" />
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Foreground Animated Gauge Arc */}
          <path
            d="M 20 110 A 80 80 0 0 1 180 110"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          />

          {/* Tick lines */}
          <line x1="20" y1="110" x2="10" y2="110" stroke="#94a3b8" strokeWidth="2" />
          <line x1="100" y1="30" x2="100" y2="20" stroke="#94a3b8" strokeWidth="2" />
          <line x1="180" y1="110" x2="190" y2="110" stroke="#94a3b8" strokeWidth="2" />
        </svg>

        {/* Center Digital Display */}
        <div className="gauge-liter-center">
          <div className="gauge-liter-value">{currentLevel}</div>
          <div className="gauge-liter-unit">Liters Available</div>
        </div>
      </div>

      <div className="gauge-stats-row">
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>EMPTY</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>0 L</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>TANK STATE</div>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: gaugeColor }}>
            {percentage < 20 ? 'CRITICAL LOW' : percentage > 85 ? 'FULL TANK' : 'OPTIMAL'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>FULL CAPACITY</div>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>{capacity} L</div>
        </div>
      </div>
    </div>
  );
};
