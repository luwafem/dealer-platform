import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from './NotificationBell';
import { Car, LogOut, User, LayoutDashboard, CreditCard, Shield, ChevronDown, Sparkles } from 'lucide-react';

const Header = () => {
  const { user, dealer, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="bg-zinc-900 p-2 rounded-xl text-white shadow-lg shadow-zinc-200">
            <Car size={20} />
          </div>
          <span className="font-bold text-lg tracking-tight text-zinc-900">AutoDealer</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/search">Browse Inventory</NavLink>
          {user && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/subscriptions">Pricing</NavLink>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <NotificationBell />
              
              {/* Profile Pill Container */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border transition-all duration-200 ${
                    isDropdownOpen 
                    ? 'bg-zinc-100 border-zinc-300 ring-4 ring-zinc-100' 
                    : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="w-7 h-7 bg-zinc-900 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                    {dealer?.business_name?.charAt(0) || 'A'}
                  </div>
                  <span className="text-sm font-semibold text-zinc-700 hidden sm:block">
                    {dealer?.business_name || 'Account'}
                  </span>
                  <ChevronDown size={14} className={`text-zinc-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] w-60 bg-white rounded-2xl shadow-2xl border border-zinc-100 py-2 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-zinc-50 mb-1">
                      <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.15em]">Manage Account</p>
                    </div>
                    
                    <DropdownLink to="/profile" onClick={() => setIsDropdownOpen(false)} icon={<User size={16} />}>Profile Settings</DropdownLink>
                    <DropdownLink to="/dashboard" onClick={() => setIsDropdownOpen(false)} icon={<LayoutDashboard size={16} />}>Inventory Manager</DropdownLink>
                    <DropdownLink to="/subscriptions" onClick={() => setIsDropdownOpen(false)} icon={<CreditCard size={16} />}>Billing & Plans</DropdownLink>
                    
                    {isAdmin && (
                      <DropdownLink to="/admin" onClick={() => setIsDropdownOpen(false)} icon={<Shield size={16} />}>Admin Control</DropdownLink>
                    )}
                    
                    <div className="border-t border-zinc-50 mt-2 pt-2 px-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl font-semibold flex items-center gap-3 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">Login</Link>
              <Link to="/register" className="px-5 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-zinc-200">
                <Sparkles size={14} /> Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, children }) => (
  <Link to={to} className="text-sm font-semibold text-zinc-500 hover:text-zinc-900 transition-colors relative group">
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-zinc-900 transition-all group-hover:w-full" />
  </Link>
);

const DropdownLink = ({ to, children, icon, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors font-medium"
  >
    <span className="text-zinc-400">{icon}</span>
    {children}
  </Link>
);

export default Header;