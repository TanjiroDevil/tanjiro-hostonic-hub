import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Users, Settings, LogOut, LayoutDashboard, Server, Zap } from 'lucide-react';
import { auth } from '../config/firebase';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900/30 backdrop-blur-md border-r border-gray-700/30">
        <div className="p-6">
          <Link to="/admin" className="flex items-center">
            <Server className="h-8 w-8 text-blue-500" />
            <span className="text-white text-xl font-bold ml-2">Admin Panel</span>
          </Link>
        </div>
        <nav className="mt-6">
          <Link
            to="/admin"
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800/50 transition-colors ${
              isActive('/admin') ? 'bg-blue-500/10 border-l-4 border-blue-500' : ''
            }`}
          >
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </Link>
          <Link
            to="/admin/users"
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800/50 transition-colors ${
              isActive('/admin/users') ? 'bg-blue-500/10 border-l-4 border-blue-500' : ''
            }`}
          >
            <Users className="h-5 w-5 mr-3" />
            Users
          </Link>
          <Link
            to="/admin/apis"
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800/50 transition-colors ${
              isActive('/admin/apis') ? 'bg-blue-500/10 border-l-4 border-blue-500' : ''
            }`}
          >
            <Zap className="h-5 w-5 mr-3" />
            API Management
          </Link>
          <Link
            to="/admin/settings"
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800/50 transition-colors ${
              isActive('/admin/settings') ? 'bg-blue-500/10 border-l-4 border-blue-500' : ''
            }`}
          >
            <Settings className="h-5 w-5 mr-3" />
            Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <div className="bg-gray-900/30 backdrop-blur-md border-b border-gray-700/30 h-16 flex items-center justify-end px-6">
          <button
            onClick={handleSignOut}
            className="flex items-center text-gray-300 hover:text-white transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>

        {/* Content Area */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}