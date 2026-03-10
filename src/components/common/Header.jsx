import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import NotificationBell from './NotificationBell';
import { Car, LogOut, User, LayoutDashboard, CreditCard, Shield, ChevronDown } from 'lucide-react';

const Header = () => {
  const { user, dealer, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Easter egg state
  const [clickCount, setClickCount] = useState(0);
  const [customText, setCustomText] = useState(null);
  const clickTimer = useRef(null);
  const revertTimer = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (clickTimer.current) clearTimeout(clickTimer.current);
      if (revertTimer.current) clearTimeout(revertTimer.current);
    };
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await signOut();
    navigate('/');
  };

  const handleLogoClick = (e) => {
    // If custom text is already active, let the link work normally
    if (customText) return;

    // If this is the 5th click (count starts at 0, so after 4 previous clicks)
    if (clickCount === 4) {
      // Trigger the Easter egg
      setCustomText('Luwafem');
      // Clear any existing revert timer
      if (revertTimer.current) clearTimeout(revertTimer.current);
      // Set timer to revert after 30 seconds
      revertTimer.current = setTimeout(() => {
        setCustomText(null);
      }, 30000);
      // Reset click count and its timer
      setClickCount(0);
      if (clickTimer.current) clearTimeout(clickTimer.current);
      // Prevent navigation so the user sees the change immediately
      e.preventDefault();
      return;
    }

    // Increment click count and set a timer to reset it after 500ms
    setClickCount(prev => prev + 1);
    if (clickTimer.current) clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      setClickCount(0);
    }, 500);

    // Let the link navigate normally for single clicks
  };

  return (
    <header className="sticky top-0 z-50 bg-[#f4f4f2] border-b-2 border-black">
      <div className="max-w-7xl mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        
        {/* Logo - Flat & Bold with Easter egg */}
        <Link to="/" className="flex items-center group" onClick={handleLogoClick}>
          <div className="bg-black p-1.5 md:p-2 border-2 border-black group-hover:bg-yellow-400 transition-colors">
            <Car size={20} className="text-white group-hover:text-black" />
          </div>
          <span className="font-black text-xl md:text-2xl uppercase tracking-tighter ml-2 md:ml-3">
            {customText ? (
              customText
            ) : (
              <>
                Auto<span className="text-yellow-500">Dealer</span>
              </>
            )}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center">
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
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-2 md:gap-4">
              <div className="border-r-2 border-black pr-2 md:pr-4 h-8 md:h-10 flex items-center">
                <NotificationBell />
              </div>
              
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 p-1 border-2 border-black transition-colors ${
                    isDropdownOpen ? 'bg-yellow-400' : 'bg-white'
                  }`}
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-black flex items-center justify-center text-white text-[10px] font-black">
                    {dealer?.business_name?.charAt(0) || 'A'}
                  </div>
                  <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter hidden sm:block">
                    {dealer?.business_name || 'Dealer'}
                  </span>
                  <ChevronDown size={14} className={`mr-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-[calc(100%+2px)] w-60 bg-white border-2 border-black z-50">
                    <div className="px-4 py-2 bg-black text-white">
                      <p className="text-[9px] font-black uppercase tracking-widest">Control Panel</p>
                    </div>
                    
                    <div className="flex flex-col">
                      <DropdownLink to="/profile" onClick={() => setIsDropdownOpen(false)} icon={<User size={14} />}>Settings</DropdownLink>
                      <DropdownLink to="/dashboard" onClick={() => setIsDropdownOpen(false)} icon={<LayoutDashboard size={14} />}>Dashboard</DropdownLink>
                      <DropdownLink to="/subscriptions" onClick={() => setIsDropdownOpen(false)} icon={<CreditCard size={14} />}>Billing</DropdownLink>
                      
                      {isAdmin && (
                        <DropdownLink to="/admin" onClick={() => setIsDropdownOpen(false)} icon={<Shield size={14} />}>Admin</DropdownLink>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-[10px] font-black uppercase bg-red-500 text-white hover:bg-black border-t-2 border-black transition-colors flex items-center gap-3"
                      >
                        <LogOut size={14} strokeWidth={3} /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                to="/login" 
                className="px-3 py-2 text-[10px] font-black uppercase tracking-widest border-2 border-black hover:bg-black hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest border-2 border-black hover:bg-yellow-400 hover:text-black transition-colors"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, children, isUrgent }) => (
  <Link 
    to={to} 
    className={`
      h-20 px-4 flex items-center text-[10px] font-black uppercase tracking-widest border-r-2 border-black first:border-l-2 hover:bg-yellow-400 transition-colors
      ${isUrgent ? 'bg-red-500 text-white hover:bg-black' : 'text-black'}
    `}
  >
    {children}
  </Link>
);

const DropdownLink = ({ to, children, icon, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase border-b-2 border-black last:border-b-0 hover:bg-yellow-400 transition-colors"
  >
    {icon}
    {children}
  </Link>
);

export default Header;