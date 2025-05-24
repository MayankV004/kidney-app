import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Home, Plus, BarChart3, FileText, LogOut, User, Settings, Apple } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface NavbarProps {
  userName?: string;
  onLogout?: () => void;
  onNavigate?: (href: string, name: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ userName = "User", onLogout, onNavigate }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks: NavLink[] = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home size={20} /> },
    { name: 'Meals', href: '/food', icon: <Apple size={20} /> },
    { name: 'Daily Total', href: '/daily-total', icon: <BarChart3 size={20} /> },
    { name: 'Diet Chart', href: '/diet-chart', icon: <FileText size={20} /> },
  ];

  // Function to get active link name from current path
  const getActiveLinkName = (pathname: string) => {
    const link = navLinks.find(link => link.href === pathname);
    return link ? link.name : '';
  };

  const currentActiveLink = getActiveLinkName(location.pathname);

  const handleLinkClick = (linkName: string, href: string) => {
    setIsOpen(false);
    
    // Call the navigation handler if provided
    if (onNavigate) {
      onNavigate(href, linkName);
    } else {
      // Fallback: use window.location for direct navigation
      window.location.href = href;
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-2">

              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                KidneyWise
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleLinkClick(link.name, link.href)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 group ${
                    currentActiveLink === link.name
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <span className={`transition-colors duration-200 ${
                    currentActiveLink === link.name ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-500'
                  }`}>
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                  {currentActiveLink === link.name && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg -z-10"></div>
                  )}
                </button>
              ))}
            </div>
          </div>



          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleLinkClick(link.name, link.href)}
              className={`w-full text-left px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 flex items-center space-x-3 ${
                currentActiveLink === link.name
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              <span className={`transition-colors duration-200 ${
                currentActiveLink === link.name ? 'text-blue-600' : 'text-gray-400'
              }`}>
                {link.icon}
              </span>
              <span>{link.name}</span>
            </button>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm font-medium">{getUserInitials(userName)}</span>
              </div>
              <div className="flex-1 text-left">
                <span className="text-gray-900 font-medium text-sm block">{userName}</span>
                <span className="text-gray-500 text-xs">View profile</span>
              </div>
            </button>
            
            {/* Mobile User Options */}
            {isUserDropdownOpen && (
              <div className="mt-2 space-y-1">
                <NavLink to="/dashboard">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <span>Profile</span>
                </button>
                </NavLink>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center space-x-3">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-3"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;