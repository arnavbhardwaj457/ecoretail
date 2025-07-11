import React from 'react';

/**
 * StatsCard component (glassmorphic, animated, dark, with icon, label, value, status, and progress ring)
 * Used for dashboard stats (e.g., Total Suppliers)
 */
export default function StatsCard({ icon, label, value, status, progress, accent = 'eco-green' }) {
  return (
    <div className="glass p-6 flex flex-col items-center shadow-glass transition-transform hover:scale-105 duration-200">
      <div className="mb-2">{icon}</div>
      <div className="text-lg font-semibold text-white mb-1">{label}</div>
      <div className="text-3xl font-bold text-eco-green mb-1">{value}</div>
      {status && <div className={`mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-eco-green/10 text-eco-green`}>{status}</div>}
      {/* Animated progress ring */}
      {typeof progress === 'number' && (
        <div className="w-16 h-16 mt-4 relative">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-eco-green/20"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
              d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32z"
            />
            <path
              className={`text-${accent}`}
              strokeWidth="4"
              strokeDasharray="100, 100"
              strokeDashoffset={100 - progress}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32z"
              style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">{progress}%</span>
        </div>
      )}
    </div>
  );
} 