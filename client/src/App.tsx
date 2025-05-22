import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DietProvider } from './context/DietContext';
import { FoodProvider } from './context/FoodContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { DietChartPage } from './pages/DietChartPage';
import { MealsPage } from './pages/MealsPage';
import { TrackingPage } from './pages/TrackingPage';
import { HelpPage } from './pages/HelpPage';
import { useAuth } from './context/AuthContext';

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/auth" />;
//   }

//   return <>{children}</>;
// };

const AppRoutes = () => {
  return (
    <Routes>
      {/* <Route path="/auth" element={<AuthPage />} /> */}
      <Route
        path="/onboarding"
        element={
         // <ProtectedRoute>
            <OnboardingPage />
          //</ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          //<ProtectedRoute>
            <DashboardPage />
          //</ProtectedRoute>
        }
      />
      <Route
        path="/diet-chart"
        element={
         // <ProtectedRoute>
            <DietChartPage />
         // </ProtectedRoute>
        }
      />
      <Route
        path="/meals"
        element={
         // <ProtectedRoute>
            <MealsPage />
         // </ProtectedRoute>
        }
      />
      <Route
        path="/tracking"
        element={
         // <ProtectedRoute>
            <TrackingPage />
         // </ProtectedRoute>
        }
      />
      <Route
        path="/help"
        element={
          //<ProtectedRoute>
            <HelpPage />
         // </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <DietProvider>
          <FoodProvider>
            <div className="flex flex-col min-h-screen bg-neutral-50">
              <Header />
              <main className="flex-grow">
                <AppRoutes />
              </main>
              <Footer />
            </div>
          </FoodProvider>
        </DietProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;