import React, { useState } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get('signup') === 'true' ? 'signup' : 'login';
  const [view, setView] = useState<'login' | 'signup'>(initialView);
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const toggleView = () => {
    setView(view === 'login' ? 'signup' : 'login');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Activity className="h-12 w-12 text-primary-500" />
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-neutral-900">
          KidneyHealth
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-600">
          Your personalized kidney health management platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white py-8 px-4 shadow-elevation-3 sm:rounded-lg sm:px-10"
        >
          {view === 'login' ? (
            <LoginForm onSwitch={toggleView} />
          ) : (
            <SignupForm onSwitch={toggleView} />
          )}
        </motion.div>
      </div>
    </div>
  );
};