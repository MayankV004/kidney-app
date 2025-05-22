import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/diet-chart', label: 'Diet Chart' },
    { path: '/meals', label: 'Meals' },
    { path: '/tracking', label: 'Tracking' },
    { path: '/help', label: 'Help & Support' },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-elevation-2 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4 md:space-x-10">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-primary-500" />
              <span className="font-bold text-xl text-neutral-900">KidneyHealth</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {isAuthenticated && navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-medium transition-colors hover:text-primary-500 ${
                  isActive(link.path)
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-neutral-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-neutral-700 hover:text-neutral-900">
                    <User className="h-5 w-5" />
                    <span className="font-medium">{user?.name || 'User'}</span>
                  </button>
                  <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white border border-neutral-200 divide-y divide-neutral-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-neutral-900">
                        {user?.name || 'User'}
                      </p>
                      <p className="text-xs text-neutral-500 truncate">
                        {user?.email || 'user@example.com'}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        Profile Settings
                      </Link>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} icon={<LogOut className="h-4 w-4" />}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?signup=true">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-neutral-200">
              {isAuthenticated ? (
                <>
                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={closeMenu}
                      className={`block px-3 py-2 rounded-md text-base font-medium ${
                        isActive(link.path)
                          ? 'text-primary-500 bg-primary-50'
                          : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4 pb-3 border-t border-neutral-200">
                    <div className="flex items-center px-3">
                      <div className="flex-shrink-0">
                        <User className="h-10 w-10 rounded-full bg-primary-100 p-2 text-primary-500" />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-neutral-800">
                          {user?.name || 'User'}
                        </div>
                        <div className="text-sm font-medium text-neutral-500">
                          {user?.email || 'user@example.com'}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1 px-2">
                      <Link
                        to="/profile"
                        onClick={closeMenu}
                        className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50"
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="pt-4 pb-3 space-y-2">
                  <Link
                    to="/auth"
                    onClick={closeMenu}
                    className="block w-full px-3 py-2 rounded-md text-center text-base font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-50 border border-neutral-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth?signup=true"
                    onClick={closeMenu}
                    className="block w-full px-3 py-2 rounded-md text-center text-base font-medium text-white bg-primary-500 hover:bg-primary-600"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};