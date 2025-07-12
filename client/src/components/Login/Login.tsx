import React, { useState } from 'react';
import { login } from '../../services/api';
import { NavLink, useNavigate } from 'react-router-dom';
import { Mail, Lock, Heart, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginProps {
  updateAuthState: (authenticated: boolean) => void;
}

export default function Login({ updateAuthState }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await login({ email, password });
      
      if (res.error) {
        setError(res.error);
      } else {
        // Store both token and user data
        if (res.token) {
          localStorage.setItem('token', res.token);
        }
        
        // Store user data separately for easy access
        if (res.user) {
          localStorage.setItem('userData', JSON.stringify(res.user));
        } else if (res.name || res.email) {
          // If user data is directly in response
          localStorage.setItem('userData', JSON.stringify({
            name: res.name,
            email: res.email,
            id: res.id
          }));
        }
        
        updateAuthState(true);
        toast.success('Login successful! Welcome back to KidneyWise!');
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      toast.error('Login failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">KidneyWise</h1>
          <p className="text-gray-600">Personalized nutrition for kidney health</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your personalized diet plan</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 hover:border-gray-300 placeholder-gray-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 hover:border-gray-300 placeholder-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-emerald-600 focus:ring-4 focus:ring-blue-200 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <NavLink
                to="/signup"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline"
              >
                Create Account
              </NavLink>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Heart className="w-4 h-4 text-emerald-500" />
            <span>Trusted by kidney patients worldwide</span>
          </div>
        </div>
      </div>
    </div>
  );
}