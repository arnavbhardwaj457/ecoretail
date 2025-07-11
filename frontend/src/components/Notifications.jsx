import React from 'react';

/**
 * Notifications component (glassmorphic, dark, animated)
 * Used for recent notifications dropdown/panel
 */
export default function Notifications({ notifications }) {
  return (
    <div className="glass absolute right-0 mt-2 w-80 p-4 shadow-glass animate-fade-in z-50">
      {notifications.map((n, i) => (
        <div key={i} className="flex items-center gap-2 p-2 rounded hover:bg-eco-bg2 transition">
          <img src={n.avatar} className="w-8 h-8 rounded-full" alt="avatar" />
          <div>
            <div className="text-white">{n.message}</div>
            <div className="text-xs text-eco-teal">{n.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
} 