import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  BarChart3, Users, Truck, Store, Lightbulb, User, LogOut, Menu
} from 'lucide-react';

// Sidebar navigation links
const navLinks = [
  { name: 'Dashboard', path: '/', icon: BarChart3 },
  { name: 'Suppliers', path: '/suppliers', icon: Users },
  { name: 'Logistics', path: '/logistics', icon: Truck },
  { name: 'Marketplace', path: '/marketplace', icon: Store },
  { name: 'AI Suggestions', path: '/ai-suggestions', icon: Lightbulb },
  { name: 'Profile', path: '/profile', icon: User },
];

/**
 * Sidebar component (glassmorphic, dark, collapsible, animated)
 * Used on all main dashboard pages
 */
export default function Sidebar({ user, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <aside
      className={`fixed z-30 h-full transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} glass bg-gradient-to-b from-eco-bg to-eco-bg2 shadow-glass hidden lg:flex flex-col`}
    >
      {/* Logo & Collapse Button */}
      <div className="flex items-center justify-between p-4">
        <span className={`text-xl font-bold text-eco-green transition-all duration-300 ${collapsed ? 'hidden' : 'block'}`}>EcoRetail</span>
        <button onClick={() => setCollapsed(!collapsed)} className="focus:outline-none">
          <Menu className="text-eco-green" />
        </button>
      </div>
      {/* Navigation */}
      <nav className="mt-8 flex flex-col gap-2">
        {navLinks.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-white/80 hover:bg-eco-green/10 hover:text-eco-green ${
                isActive ? 'bg-eco-green/20 text-eco-green' : ''
              } ${collapsed ? 'justify-center px-2' : ''}`
            }
          >
            <Icon className="w-6 h-6" />
            {!collapsed && <span>{name}</span>}
          </NavLink>
        ))}
      </nav>
      {/* User & Logout */}
      <div className="mt-auto p-4 border-t border-white/10 flex flex-col items-center">
        {!collapsed && (
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-eco-green flex items-center justify-center text-white font-bold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div className="text-white font-semibold">{user?.username}</div>
              <div className="text-xs text-eco-green">{user?.company?.name}</div>
            </div>
          </div>
        )}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-white/70 hover:text-eco-green transition-colors mt-2"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
} 