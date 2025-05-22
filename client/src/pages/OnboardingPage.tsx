import React from 'react';
import { Navigate } from 'react-router-dom';
import { OnboardingForm } from '../components/onboarding/OnboardingForm';
import { useAuth } from '../context/AuthContext';

export const OnboardingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  // Redirect if user has already completed onboarding
  if (user?.ckdStage) {
    return <Navigate to="/dashboard" />;
  }
  
  const handleCompleteOnboarding = () => {
    window.location.href = '/dashboard';
  };
  
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col justify-center">
      <OnboardingForm onComplete={handleCompleteOnboarding} />
    </div>
  );
};