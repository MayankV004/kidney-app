import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import FoodSearchComponent from './components/food/FoodSearchComponent';
import Navbar from './components/Navbar/Navbar';
import DietChartGenerator from './components/DietChartGenerator/DietChartGenerator';
import NutrientDashboard from './components/NutrientDashboard/NutrientDashboard';
import FavouriteFoodComponent from './components/favouriteFood/FavouriteFoodComponent';



export default function App(): JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
  <div>
    {isAuthenticated && <Navbar />}
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
      <Route 
        path="/diet-chart" 
        element={isAuthenticated ? <DietChartGenerator /> : <Navigate to="/login" />} 
      />
       <Route 
        path="/daily-total" 
        element={isAuthenticated ?<NutrientDashboard/> : <Navigate to="/login" />} 
      />
      <Route 
        path="/favourite-food" 
        element={isAuthenticated ?<FavouriteFoodComponent/> : <Navigate to="/login" />} 
      />
    </Routes>
  </div>
);
}
