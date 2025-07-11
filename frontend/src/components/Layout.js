import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';

/**
 * Layout component (uses Sidebar and Header, applies dark theme and glassmorphism)
 * Wraps all main dashboard pages
 */
export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(true); // default to dark
  const [showNotifications, setShowNotifications] = useState(false);

  // Theme toggle handler
  const handleThemeToggle = () => {
    setDarkMode((d) => !d);
    document.documentElement.classList.toggle('dark');
  };

  // Logout handler
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Example notifications (replace with real data)
  const notifications = [
    { avatar: user?.avatar || '', message: 'Supplier added', time: '2m ago' },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-eco-bg' : 'bg-white'} flex`}> {/* Main layout */}
      <Sidebar user={user} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col min-h-screen lg:pl-64">
        <Header
          user={user}
          onThemeToggle={handleThemeToggle}
          darkMode={darkMode}
          onNotificationsClick={() => setShowNotifications((s) => !s)}
        />
        {/* Notifications dropdown */}
        {showNotifications && (
          <div className="absolute right-8 top-20">
            {/* Import Notifications component if needed */}
            {/* <Notifications notifications={notifications} /> */}
          </div>
        )}
        {/* Page content */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 