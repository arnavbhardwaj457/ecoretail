import React from 'react';

/**
 * ChartCard component (glassmorphic, dark, animated)
 * Used to wrap dashboard charts (bar/doughnut)
 */
export default function ChartCard({ title, children }) {
  return (
    <div className="glass p-6 shadow-glass">
      <div className="text-white font-semibold mb-2">{title}</div>
      <div className="w-full h-48 animate-fade-in">{children}</div>
    </div>
  );
} 