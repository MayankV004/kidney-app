import React, { useState, useEffect } from 'react';
import { LogOut, User, Home, Settings, Bell, AlertCircle, Edit3, X, Save, ChevronRight, FileText, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserProfile,EditFormData, CKDFormData } from './dashboard-types';
import { toast } from 'react-hot-toast';

interface DashboardProps {
  updateAuthState: (authenticated: boolean) => void;
}

export default function Dashboard({ updateAuthState }: DashboardProps) {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCKDModalOpen, setIsCKDModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
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

  const [ckdFormData, setCKDFormData] = useState<CKDFormData>({
    howDidYouHear: '',
    ckdStage: '',
    onDialysis: false,
    hasDiabetes: false,
    hasHypertension: false
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

  const ckdStageOptions = [
    { value: 'STAGE_1', label: 'CKD Stage 1' },
    { value: 'STAGE_2', label: 'CKD Stage 2' },
    { value: 'STAGE_3', label: 'CKD Stage 3' },
    { value: 'STAGE_4', label: 'CKD Stage 4' },
    { value: 'STAGE_5', label: 'CKD Stage 5' },
    { value: 'NOT_DIAGNOSED', label: 'Not yet diagnosed' }
  ];

  const howDidYouHearOptions = [
    'Doctor/Healthcare Provider',
    'Search Engine (Google, Bing)',
    'Social Media',
    'Friend/Family Recommendation',
    'Medical Website/Blog',
    'Health Forum/Community',
    'Advertisement',
    'Other'
  ];

  // Check if profile is complete for CKD questionnaire
const isProfileComplete = () => {
  if (!userProfile) return false;
  // console.log("Here is user profile",userProfile.medicalConditions?.length);
  
  return userProfile.ckdStage && 
        
         (userProfile.medicalConditions?.length ==0||   userProfile.medicalConditions?.length==1 ||userProfile.medicalConditions?.length==2 || userProfile.medicalConditions?.length==3)
         
};

  // Fetch user profile from backend
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_ROUTE}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      //  console.log(response.ok)
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const userData = await response.json();
    // console.log(userData)
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

      const response = await fetch(`${import.meta.env.VITE_API_ROUTE}/api/user/profile`, {
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
      console.log('Updated user profile:', result.user);
      setIsEditModalOpen(false);
      setIsCKDModalOpen(false);
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

  useEffect(() => {
  if (userProfile) {
    const complete = userProfile.ckdStage && 
                    userProfile.howDidYouHear &&
                    userProfile.onDialysis !== undefined &&
                    userProfile.hasDiabetes !== undefined &&
                    userProfile.hasHypertension !== undefined;
    // console.log(userProfile.onDialysis);
          
    setProfileComplete(Boolean(complete));
  }
}, [userProfile]);
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

  // Initialize CKD form when modal opens
  useEffect(() => {
    if (isCKDModalOpen && userProfile) {
      setCKDFormData({
        howDidYouHear: userProfile.howDidYouHear || '',
        ckdStage: userProfile.ckdStage || '',
        onDialysis: userProfile.onDialysis || false,
        hasDiabetes: userProfile.hasDiabetes || false,
        hasHypertension: userProfile.hasHypertension || false
      });
    }
  }, [isCKDModalOpen, userProfile]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    updateAuthState(false);
    toast.success('You have been logged out successfully.');
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

  const handleCKDSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare CKD update data
    const updateData: Partial<UserProfile> = {
      howDidYouHear: ckdFormData.howDidYouHear,
      ckdStage: ckdFormData.ckdStage,
      onDialysis: ckdFormData.onDialysis,
      hasDiabetes: ckdFormData.hasDiabetes,
      hasHypertension: ckdFormData.hasHypertension,
      profileCompleted: true,
      // Update medical conditions based on the responses
      medicalConditions: [
        ...(ckdFormData.hasDiabetes ? ['Diabetes'] : []),
        ...(ckdFormData.hasHypertension ? ['Hypertension'] : []),
        ...(ckdFormData.onDialysis ? ['On Dialysis'] : [])
      ]
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

  const formatCKDStage = (stage: string) => {
    return stage.replace('STAGE_', 'CKD Stage ').replace('NOT_DIAGNOSED', 'Not yet diagnosed');
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-lg sm:text-xl font-bold text-white">
                  {getUserInitials(userProfile.name)}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Welcome back, {userProfile.name}!</h2>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">Here's what's happening with your account today.</p>
              </div>
            </div>
            <div className="flex space-x-3 w-full sm:w-auto">
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex-1 sm:flex-none"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-sm sm:text-base">Edit Profile</span>
              </button>
            </div>
          </div>
        </div>

        {/* Profile Completion Alert */}
        {!isProfileComplete() && (
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-start sm:items-center space-x-3 w-full sm:w-auto">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-orange-900">Complete Your CKD Profile</h3>
                  <p className="text-orange-700 mt-1 text-sm sm:text-base">
                    Help us create a personalized diet chart by completing your kidney health profile
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCKDModalOpen(true)}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors w-full sm:w-auto"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm sm:text-base">Complete Profile</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Diet Chart Generation Card */}
        {isProfileComplete() && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-start sm:items-center space-x-3 w-full sm:w-auto">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-semibold text-green-900">Generate Your Personalized Diet Chart</h3>
                  <p className="text-green-700 mt-1 text-sm sm:text-base">
                    Your profile is complete! Generate a customized CKD-friendly diet plan
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/diet-chart')}
                className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors w-full sm:w-auto"
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm sm:text-base">Generate Diet Chart</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Enhanced User Info Card */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Basic Information</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 space-y-1 sm:space-y-0">
                <span className="text-gray-600 text-sm sm:text-base">Full Name</span>
                <span className="font-medium text-gray-900 text-sm sm:text-base break-words">{userProfile.name}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-t border-gray-100 space-y-1 sm:space-y-0">
                <span className="text-gray-600 text-sm sm:text-base">Email Address</span>
                <span className="font-medium text-gray-900 text-sm sm:text-base break-all">{userProfile.email}</span>
              </div>
              {userProfile.age && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-t border-gray-100 space-y-1 sm:space-y-0">
                  <span className="text-gray-600 text-sm sm:text-base">Age</span>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{userProfile.age} years</span>
                </div>
              )}
              {userProfile.gender && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-t border-gray-100 space-y-1 sm:space-y-0">
                  <span className="text-gray-600 text-sm sm:text-base">Gender</span>
                  <span className="font-medium text-gray-900 capitalize text-sm sm:text-base">{userProfile.gender}</span>
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-t border-gray-100 space-y-1 sm:space-y-0">
                <span className="text-gray-600 text-sm sm:text-base">Member Since</span>
                <span className="font-medium text-gray-900 text-sm sm:text-base">{formatDate(userProfile.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Health & CKD Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Health & CKD Information</h3>
            <div className="space-y-2 sm:space-y-3">
              {userProfile.height && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 space-y-1 sm:space-y-0">
                  <span className="text-gray-600 text-sm sm:text-base">Height</span>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{userProfile.height} cm</span>
                </div>
              )}
              {userProfile.weight && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-t border-gray-100 space-y-1 sm:space-y-0">
                  <span className="text-gray-600 text-sm sm:text-base">Weight</span>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{userProfile.weight} kg</span>
                </div>
              )}
              {userProfile.ckdStage && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-t border-gray-100 space-y-1 sm:space-y-0">
                  <span className="text-gray-600 text-sm sm:text-base">CKD Stage</span>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{formatCKDStage(userProfile.ckdStage)}</span>
                </div>
              )}
              {userProfile.onDialysis !== undefined && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-t border-gray-100 space-y-1 sm:space-y-0">
                  <span className="text-gray-600 text-sm sm:text-base">On Dialysis</span>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{userProfile.onDialysis ? 'Yes' : 'No'}</span>
                </div>
              )}
              {userProfile.hasDiabetes !== undefined && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-t border-gray-100 space-y-1 sm:space-y-0">
                  <span className="text-gray-600 text-sm sm:text-base">Has Diabetes</span>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{userProfile.hasDiabetes ? 'Yes' : 'No'}</span>
                </div>
              )}
              {userProfile.hasHypertension !== undefined && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-t border-gray-100 space-y-1 sm:space-y-0">
                  <span className="text-gray-600 text-sm sm:text-base">Has Hypertension</span>
                  <span className="font-medium text-gray-900 text-sm sm:text-base">{userProfile.hasHypertension ? 'Yes' : 'No'}</span>
                </div>
              )}
              {userProfile.medicalConditions && userProfile.medicalConditions.length > 0 && (
                <div className="py-2 border-t border-gray-100">
                  <span className="text-gray-600 block mb-2 text-sm sm:text-base">Medical Conditions</span>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {userProfile.medicalConditions.map((condition, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
                      >
                        {condition}
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
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Profile</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editFormData.name}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={editFormData.age}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, age: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      min="13"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={editFormData.gender}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Health & Fitness</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                    <input
                      type="number"
                      value={editFormData.height}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, height: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      min="30"
                      max="300"
                      step="0.1"
                    />
                  </div>
                  <div className="sm:col-span-2 lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
                    <select
                      value={editFormData.activityLevel}
                      onChange={(e) => setEditFormData(prev => ({ ...prev, activityLevel: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
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
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
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
      {isCKDModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Complete CKD Profile</h2>
                <button
                  onClick={() => setIsCKDModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCKDSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* CKD Stage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CKD Stage</label>
                <select
                  value={ckdFormData.ckdStage}
                  onChange={(e) => setCKDFormData(prev => ({ ...prev, ckdStage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  required
                >
                  <option value="">Select CKD Stage</option>
                  {ckdStageOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* How did you hear about us */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How did you hear about us?</label>
                <select
                  value={ckdFormData.howDidYouHear}
                  onChange={(e) => setCKDFormData(prev => ({ ...prev, howDidYouHear: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  required
                >
                  <option value="">Select an option</option>
                  {howDidYouHearOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Medical Conditions */}
              <div className="space-y-3 sm:space-y-4">
                <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="onDialysis"
                    checked={ckdFormData.onDialysis}
                    onChange={(e) => setCKDFormData(prev => ({ ...prev, onDialysis: e.target.checked }))}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="onDialysis" className="text-sm text-gray-700">Currently on Dialysis</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasDiabetes"
                    checked={ckdFormData.hasDiabetes}
                    onChange={(e) => setCKDFormData(prev => ({ ...prev, hasDiabetes: e.target.checked }))}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="hasDiabetes" className="text-sm text-gray-700">Diagnosed with Diabetes</label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasHypertension"
                    checked={ckdFormData.hasHypertension}
                    onChange={(e) => setCKDFormData(prev => ({ ...prev, hasHypertension: e.target.checked }))}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="hasHypertension" className="text-sm text-gray-700">Have Hypertension</label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCKDModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 text-sm sm:text-base"
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
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}