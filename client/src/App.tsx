import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import FoodSearchComponent from './components/food/FoodSearchComponent';


export default function App(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false);
  }, []);

  // Function to update auth state (pass this to Login/Signup components)
  const updateAuthState = (authenticated: boolean): void => {
    setIsAuthenticated(authenticated);
  };

  // Show loading while checking auth state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login updateAuthState={updateAuthState} />} 
      />
      <Route 
        path="/signup" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Signup updateAuthState={updateAuthState} />} 
      />
      <Route 
        path="/dashboard" 
        element={isAuthenticated ? <Dashboard updateAuthState={updateAuthState} /> : <Navigate to="/login" />} 
      />
      <Route 
        path="/food" 
        element={isAuthenticated ? <FoodSearchComponent /> : <Navigate to="/login" />} 
      />
    </Routes>
  );
}