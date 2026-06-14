import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Server, Menu, X, LogOut, User, ChevronDown, Download, Music2, Youtube, Instagram, Ghost } from 'lucide-react';
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950">
      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 left-0">
        <div className="bg-gray-900/30 backdrop-blur-md border-b-2 border-gray-700/30 rounded-b-2xl">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <Server className="h-8 w-8 text-blue-500" />
                <span className="text-white text-xl font-bold ml-2">Hostonic</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-gray-300 hover:text-blue-500 transition-colors">Home</Link>
                <Link to="/features" className="text-gray-300 hover:text-blue-500 transition-colors">Features</Link>
                <Link to="/apis" className="text-gray-300 hover:text-blue-500 transition-colors">APIs</Link>
                <Link to="/pricing" className="text-gray-300 hover:text-blue-500 transition-colors">Pricing</Link>
                <Link to="/contact" className="text-gray-300 hover:text-blue-500 transition-colors">Contact</Link>
              </div>

              {/* Right Side Items */}
              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Link to="/profile" className="flex items-center space-x-2 text-gray-300 hover:text-blue-500 transition-colors">
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-2 text-gray-300 hover:text-blue-500 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link 
                    to="/auth"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-300 hover:text-white"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                  <Link to="/" className="block px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">Home</Link>
                  <Link to="/features" className="block px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">Features</Link>
                  <Link to="/apis" className="block px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">APIs</Link>
                  <Link to="/pricing" className="block px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">Pricing</Link>
                  <Link to="/contact" className="block px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">Contact</Link>
                  {user ? (
                    <>
                      <Link to="/profile" className="block px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md">Profile</Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      className="block w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <Server className="h-6 w-6 text-blue-500" />
                <span className="text-white text-lg font-bold ml-2">Hostonic</span>
              </div>
              <p className="text-gray-400 text-sm">
                Providing reliable hosting solutions with exceptional performance and security.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">About Us</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">Pricing</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">Web Hosting</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">VPS Hosting</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">Dedicated Servers</Link></li>
                <li><Link to="/features" className="text-gray-400 hover:text-blue-500 text-sm transition-colors">Cloud Solutions</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400 text-sm">
                  <a href="https://wa.me/967772350066" className="hover:text-blue-500 transition-colors">WhatsApp Support</a>
                </li>
                <li className="flex items-center text-gray-400 text-sm">
                  24/7 Customer Support
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800/50 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Hostonic. All rights reserved.</p>
            <p className="text-gray-500 text-xs mt-2 md:mt-0 font-light italic">
              Created with ♥ by Mohammed (Tanjiro)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}