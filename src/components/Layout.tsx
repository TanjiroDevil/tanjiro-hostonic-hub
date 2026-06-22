import React, { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { Server, Menu, X, LogOut, User, ChevronDown, Download, Music2, Youtube, Instagram, Ghost, Facebook, Music } from 'lucide-react';
import { auth } from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDownloadsOpen, setIsDownloadsOpen] = useState(false);
  const [isMobileDownloadsOpen, setIsMobileDownloadsOpen] = useState(false);
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

                {/* Downloads Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsDownloadsOpen(true)}
                  onMouseLeave={() => setIsDownloadsOpen(false)}
                >
                  <Link
                    to="/downloads"
                    className="flex items-center gap-1 text-gray-300 hover:text-blue-500 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Downloads</span>
                    <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${isDownloadsOpen ? 'rotate-180' : ''}`} />
                  </Link>

                  {isDownloadsOpen && (
                    <div className="absolute top-full right-0 pt-3 w-72 z-50">
                      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/60 rounded-2xl shadow-2xl shadow-blue-500/10 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        {[
                          { name: 'Spotify', desc: 'Search & Download tracks', to: '/spotify-search', icon: Music2, gradient: 'from-emerald-500 to-green-700', hover: 'hover:bg-emerald-500/10' },
                          { name: 'Facebook', desc: 'Download videos & reels', to: '/downloads/facebook', icon: Facebook, gradient: 'from-blue-500 to-blue-700', hover: 'hover:bg-blue-500/10' },
                          { name: 'Instagram', desc: 'Download reels & posts', to: '/downloads/instagram', icon: Instagram, gradient: 'from-purple-500 via-pink-500 to-orange-500', hover: 'hover:bg-pink-500/10' },
                        ].map((s) => (
                          <Link
                            key={s.name}
                            to={s.to}
                            onClick={() => setIsDownloadsOpen(false)}
                            className={`flex items-center gap-3 p-3 rounded-xl transition-colors group ${s.hover}`}
                          >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                              <s.icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-white font-semibold text-sm">{s.name}</div>
                              <div className="text-gray-400 text-xs">{s.desc}</div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">LIVE</span>
                          </Link>
                        ))}

                        {[
                          { name: 'YouTube', icon: Youtube, gradient: 'from-red-500 to-rose-700' },
                          { name: 'TikTok', icon: Music2, gradient: 'from-pink-500 via-fuchsia-500 to-cyan-500' },
                          { name: 'Snapchat', icon: Ghost, gradient: 'from-yellow-400 to-amber-500' },
                        ].map((s) => (
                          <div
                            key={s.name}
                            className="flex items-center gap-3 p-3 rounded-xl opacity-60 cursor-not-allowed"
                          >
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg`}>
                              <s.icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-white font-semibold text-sm">{s.name}</div>
                              <div className="text-gray-400 text-xs">Coming soon</div>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/60 text-gray-300 border border-gray-600/50">SOON</span>
                          </div>
                        ))}

                        <Link
                          to="/downloads"
                          onClick={() => setIsDownloadsOpen(false)}
                          className="block text-center mt-2 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-300 text-xs font-semibold hover:from-blue-600/30 hover:to-cyan-600/30 transition-all border border-blue-500/20"
                        >
                          Explore all services →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

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

                  {/* Mobile Downloads collapsible */}
                  <button
                    onClick={() => setIsMobileDownloadsOpen(!isMobileDownloadsOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Downloads
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isMobileDownloadsOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMobileDownloadsOpen && (
                    <div className="ml-6 space-y-1 border-l border-gray-700/50 pl-3">
                      <Link to="/downloads" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-blue-300 hover:bg-gray-800 rounded-md text-sm">
                        All services
                      </Link>
                      <Link to="/spotify-search" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md text-sm">
                        <Music2 className="h-4 w-4 text-emerald-400" /> Spotify
                      </Link>
                      <Link to="/downloads/facebook" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md text-sm">
                        <Facebook className="h-4 w-4 text-blue-400" /> Facebook
                      </Link>
                      <Link to="/downloads/instagram" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-md text-sm">
                        <Instagram className="h-4 w-4 text-pink-400" /> Instagram
                      </Link>
                      <div className="px-3 py-2 text-gray-500 text-xs">YouTube · TikTok · Snapchat (قريباً)</div>
                    </div>
                  )}

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