import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from './NotificationBell';
import { Car, LogOut, User, LayoutDashboard, CreditCard, Shield, ChevronDown, Plus, AlertTriangle } from 'lucide-react';

const Header = () => {
  const { user, dealer, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* Logo - Bold & Boxy */}
        <Link to="/" className="flex items-center group">
          <div className="bg-black p-2 border-2 border-black group-hover:bg-yellow-400 transition-colors">
            <Car size={22} className="text-white group-hover:text-black" />
          </div>
          <span className="font-black text-2xl uppercase tracking-[ -0.05em] ml-3 hidden sm:block">
            AutoDealer<span className="text-yellow-500 italic">®</span>
          </span>
        </Link>

        {/* Desktop Navigation - Minimal & Direct */}
        <nav className="hidden lg:flex items-center space-x-1">
          <NavLink to="/search">Inventory</NavLink>
          <NavLink to="/distress" isUrgent>Distress</NavLink>
          {user && (
            <>
              <NavLink to="/dashboard">Terminal</NavLink>
              <NavLink to="/subscriptions">Access</NavLink>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="border-r-2 border-black pr-2 sm:pr-4 h-10 flex items-center">
                <NotificationBell />
              </div>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-3 p-1 border-2 border-black transition-all ${
                    isDropdownOpen ? 'bg-yellow-400 shadow-none translate-x-[2px] translate-y-[2px]' : 'bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                  }`}
                >
                  <div className="w-8 h-8 bg-black flex items-center justify-center text-white text-xs font-black">
                    {dealer?.business_name?.charAt(0) || 'A'}
                  </div>
                  <span className="text-xs font-black uppercase tracking-tighter hidden md:block">
                    {dealer?.business_name || 'Dealer'}
                  </span>
                  <ChevronDown size={16} className={`mr-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu - Sharp Box */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+10px)] w-64 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] py-0 z-50">
                    <div className="px-4 py-3 bg-black text-white">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em]">Dealer Control</p>
                    </div>
                    
                    <div className="divide-y-2 divide-black">
                      <DropdownLink to="/profile" onClick={() => setIsDropdownOpen(false)} icon={<User size={16} />}>User Settings</DropdownLink>
                      <DropdownLink to="/dashboard" onClick={() => setIsDropdownOpen(false)} icon={<LayoutDashboard size={16} />}>Market Dashboard</DropdownLink>
                      <DropdownLink to="/subscriptions" onClick={() => setIsDropdownOpen(false)} icon={<CreditCard size={16} />}>Billing & Credits</DropdownLink>
                      
                      {isAdmin && (
                        <DropdownLink to="/admin" onClick={() => setIsDropdownOpen(false)} icon={<Shield size={16} />}>Admin Terminal</DropdownLink>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-xs font-black uppercase bg-red-500 text-white hover:bg-black transition-colors flex items-center gap-3"
                      >
                        <LogOut size={16} strokeWidth={3} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-xs font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2.5 bg-black text-white text-xs font-black uppercase tracking-widest border-2 border-black hover:bg-yellow-400 hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
                Join Network
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, children, className, isUrgent }) => (
  <Link to={to} className={`
    px-4 py-2 text-xs font-black uppercase tracking-[0.1em] border-2 border-transparent hover:border-black hover:bg-white transition-all
    ${isUrgent ? 'text-red-600 hover:bg-red-50' : 'text-black'}
    ${className}
  `}>
    {children}
  </Link>
);

const DropdownLink = ({ to, children, icon, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-tighter hover:bg-yellow-400 transition-colors group"
  >
    <span className="text-black">{icon}</span>
    {children}
  </Link>
);

export default Header;