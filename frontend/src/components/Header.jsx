import React from 'react';
import { Bell, Sun, Moon } from 'lucide-react';

/**
 * Header component (glassmorphic, sticky, dark, with user avatar, notifications, and theme toggle)
 * Used at the top of all dashboard pages
 */
export default function Header({ user, onThemeToggle, darkMode, onNotificationsClick }) {
  return (
    <header className="sticky top-0 z-20 glass flex items-center justify-between px-6 py-3 shadow-glass backdrop-blur-md">
      <div className="flex items-center gap-4">
        <span className="text-2xl font-bold text-eco-green">EcoRetail</span>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative" onClick={onNotificationsClick} aria-label="Notifications">
          <Bell className="text-eco-green w-6 h-6" />
          {/* Notification badge (example) */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-eco-bg animate-pulse" />
        </button>
        <button onClick={onThemeToggle} aria-label="Toggle theme">
          {darkMode ? <Sun className="text-yellow-400 w-6 h-6" /> : <Moon className="text-eco-green w-6 h-6" />}
        </button>
        <img
          src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'U'}`}
          alt="User"
          className="w-9 h-9 rounded-full border-2 border-eco-green shadow"
        />
      </div>
    </header>
  );
} 