import React from 'react';

/**
 * ActionTile component (glassmorphic, dark, animated)
 * Used for quick dashboard actions (e.g., Track sustainability metrics)
 */
export default function ActionTile({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="glass flex items-center gap-3 p-4 rounded-xl shadow-glass hover:bg-eco-green/10 transition duration-200 text-white font-medium"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
} 