import React, { useState, useEffect } from 'react';
import { LogOut, User, Home, Settings, Bell, AlertCircle, Edit3, X, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  updateAuthState: (authenticated: boolean) => void;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  activityLevel?: string;
  dietaryPreferences?: string[];
  healthGoals?: string[];
  createdAt: string;
  updatedAt: string;
}

interface EditFormData {
  name: string;
  email: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  dietaryPreferences: string[];
  healthGoals: string[];
}

export default function Dashboard({ updateAuthState }: DashboardProps) {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData>({
    name: '',
    email: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    dietaryPreferences: [],
    healthGoals: []
  });

  // Common dietary preferences and health goals for dropdowns
  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 
    'Paleo', 'Mediterranean', 'Low-Carb', 'Low-Fat', 'Halal', 'Kosher'
  ];

  const healthGoalOptions = [
    'Weight Loss', 'Weight Gain', 'Muscle Building', 'Maintenance',
    'Improved Energy', 'Better Sleep', 'Reduced Stress', 'Heart Health',
    'Diabetes Management', 'Athletic Performance'
  ];

  const activityLevels = [
    'sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active'
  ];

  const genderOptions = ['male', 'female', 'other'];

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
       console.log(response)
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const userData = await response.json();
    console.log(userData)
      setUserProfile(userData);
      setError(null);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (updatedData: Partial<UserProfile>) => {
    try {
      setIsUpdating(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(`Failed to update profile: ${response.status}`);
      }

      const result = await response.json();
      setUserProfile(result.user);
      setIsEditModalOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error updating user profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  // Initialize edit form when modal opens
  useEffect(() => {
    if (isEditModalOpen && userProfile) {
      setEditFormData({
        name: userProfile.name || '',
        email: userProfile.email || '',
        age: userProfile.age?.toString() || '',
        gender: userProfile.gender || '',
        height: userProfile.height?.toString() || '',
        weight: userProfile.weight?.toString() || '',
        activityLevel: userProfile.activityLevel || '',
        dietaryPreferences: userProfile.dietaryPreferences || [],
        healthGoals: userProfile.healthGoals || []
      });
    }
  }, [isEditModalOpen, userProfile]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    updateAuthState(false);
    navigate('/login');
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare update data
    const updateData: Partial<UserProfile> = {
      name: editFormData.name,
      email: editFormData.email,
      ...(editFormData.age && { age: parseInt(editFormData.age) }),
      ...(editFormData.gender && { gender: editFormData.gender }),
      ...(editFormData.height && { height: parseFloat(editFormData.height) }),
      ...(editFormData.weight && { weight: parseFloat(editFormData.weight) }),
      ...(editFormData.activityLevel && { activityLevel: editFormData.activityLevel }),
      dietaryPreferences: editFormData.dietaryPreferences,
      healthGoals: editFormData.healthGoals
    };

    updateUserProfile(updateData);
  };

  const handleArrayFieldChange = (field: 'dietaryPreferences' | 'healthGoals', value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 2);
  };

  const formatActivityLevel = (level: string) => {
    return level.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserProfile}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No user data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-white">
                    {getUserInitials(userProfile.name)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{userProfile.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-white">
                  {getUserInitials(userProfile.name)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome back, {userProfile.name}!</h2>
                <p className="text-gray-600 mt-1">Here's what's happening with your account today.</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Manage your account settings and preferences</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">Stay updated with your latest activities</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Profile</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-gray-600 text-sm">View and edit your profile information</p>
          </div>
        </div>

        {/* Enhanced User Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Full Name</span>
                <span className="font-medium text-gray-900">{userProfile.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="text-gray-600">Email Address</span>
                <span className="font-medium text-gray-900">{userProfile.email}</span>
              </div>
              {userProfile.age && (
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-600">Age</span>
                  <span className="font-medium text-gray-900">{userProfile.age} years</span>
                </div>
              )}
              {userProfile.gender && (
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-600">Gender</span>
                  <span className="font-medium text-gray-900 capitalize">{userProfile.gender}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-t border-gray-100">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium text-gray-900">{formatDate(userProfile.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Health & Fitness Info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health & Fitness</h3>
            <div className="space-y-3">
              {userProfile.height && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Height</span>
                  <span className="font-medium text-gray-900">{userProfile.height} cm</span>
                </div>
              )}
              {userProfile.weight && (
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-medium text-gray-900">{userProfile.weight} kg</span>
                </div>
              )}
              {userProfile.activityLevel && (
                <div className="flex justify-between items-center py-2 border-t border-gray-100">
                  <span className="text-gray-600">Activity Level</span>
                  <span className="font-medium text-gray-900">{formatActivityLevel(userProfile.activityLevel)}</span>
                </div>
              )}
              {userProfile.dietaryPreferences && userProfile.dietaryPreferences.length > 0 && (
                <div className="py-2 border-t border-gray-100">
                  <span className="text-gray-600 block mb-2">Dietary Preferences</span>
                  <div className="flex flex-wrap gap-1">
                    {userProfile.dietaryPreferences.map((pref, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {userProfile.healthGoals && userProfile.healthGoals.length > 0 && (
                <div className="py-2 border-t border-gray-100">
                  <span className="text-gray-600 block mb-2">Health Goals</span>
                  <div className="flex flex-wrap gap-1">
                    {userProfile.healthGoals.map((goal, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={editFormData.age}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, age: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="13"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={editFormData.gender}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      {genderOptions.map(option => (
                        <option key={option} value={option}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Health & Fitness */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Health & Fitness</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={editFormData.height}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, height: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="100"
                      max="250"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      value={editFormData.weight}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, weight: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="30"
                      max="300"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                    <select
                      value={editFormData.activityLevel}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, activityLevel: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Activity Level</option>
                      {activityLevels.map(level => (
                        <option key={level} value={level}>
                          {formatActivityLevel(level)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Dietary Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary Preferences</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {dietaryOptions.map(option => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editFormData.dietaryPreferences.includes(option)}
                        onChange={() => handleArrayFieldChange('dietaryPreferences', option)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Health Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Health Goals</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {healthGoalOptions.map(goal => (
                    <label key={goal} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editFormData.healthGoals.includes(goal)}
                        onChange={() => handleArrayFieldChange('healthGoals', goal)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isUpdating ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isUpdating ? 'Updating...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Logout Button - Fixed Position */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}