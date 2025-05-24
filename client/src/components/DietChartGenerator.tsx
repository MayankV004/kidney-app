import React, { useState, useEffect } from 'react';
import { User, Activity, Settings, CheckCircle, AlertCircle, RefreshCw, Calendar } from 'lucide-react';

// Type definitions
interface DietChart {
  _id: string;
  userId: string;
  protein: number;
  calories: number;
  carbohydrates: number;
  fats: number;
  potassium: number;
  phosphorus: number;
  sodium: number;
  calcium: number;
  magnesium: number;
  water: number;
  updatedAt: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  age?: number;
  ckdStage?: 'STAGE_1' | 'STAGE_2' | 'STAGE_3' | 'STAGE_4' | 'STAGE_5';
  createdAt: string;
  updatedAt: string;
  dietChart?: DietChart;
}

interface NutrientTargets {
  protein: number;
  calories: number;
  carbohydrates: number;
  fats: number;
  potassium: number;
  phosphorus: number;
  sodium: number;
  calcium: number;
  magnesium: number;
  water: number;
}

interface ApiResponse<T = any> {
  message?: string;
  error?: string;
  targets?: T;
  user?: T;
}

type GenerationMethod = 'AGE_BASED' | 'CKD_STAGE' | 'CUSTOM' | '';

const DietChartGenerator: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<GenerationMethod>('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [generatedTargets, setGeneratedTargets] = useState<NutrientTargets | null>(null);
  const [showGenerateNew, setShowGenerateNew] = useState<boolean>(false);
  const [customValues, setCustomValues] = useState<NutrientTargets>({
    protein: 60,
    calories: 2000,
    carbohydrates: 300,
    fats: 65,
    potassium: 2000,
    phosphorus: 800,
    sodium: 2000,
    calcium: 1000,
    magnesium: 300,
    water: 2000
  });
  const [ageInput, setAgeInput] = useState<string>('');

  // Fetch user profile on component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found');
        return;
      }

      const response = await fetch('http://localhost:5000/api/user/profile', {
         method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData: UserProfile = await response.json();
        console.log(userData);
        
        setUserProfile(userData);
        if (userData.age) {
          setAgeInput(userData.age.toString());
        }
        
        // If user has existing diet chart, don't show generate new by default
        if (userData.dietChart) {
          setShowGenerateNew(false);
        }
      } else {
        const errorData: ApiResponse = await response.json();
        setMessage(errorData.error || 'Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setMessage('Network error occurred while fetching profile');
    }
  };

  const generateDietChart = async (method: 'AGE_BASED' | 'CKD_STAGE', additionalData: Record<string, any> = {}): Promise<void> => {
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found');
        return;
      }

      const requestBody = { method, ...additionalData };
      
      const response = await fetch('http://localhost:5000/api/generate-diet-chart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      const data: ApiResponse<NutrientTargets> = await response.json();
      
      if (response.ok && data.targets) {
        setMessage(data.message || 'Diet chart generated successfully');
        setGeneratedTargets(data.targets);
        // Refresh user profile to get updated diet chart
        await fetchUserProfile();
        setShowGenerateNew(false);
      } else {
        setMessage(data.error || 'Error generating diet chart');
      }
    } catch (error) {
      setMessage('Network error occurred');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveCustomValues = async (): Promise<void> => {
    setLoading(true);
    setMessage('');
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Authentication token not found');
        return;
      }
      
      const response = await fetch('http://localhost:5000/api/nutrient-targets', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customValues)
      });
      
      const data: ApiResponse = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'Custom diet chart saved successfully');
        setGeneratedTargets(customValues);
        // Refresh user profile to get updated diet chart
        await fetchUserProfile();
        setShowGenerateNew(false);
      } else {
        setMessage(data.error || 'Error saving custom values');
      }
    } catch (error) {
      setMessage('Network error occurred');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMethodSelect = (method: GenerationMethod): void => {
    setSelectedMethod(method);
    setMessage('');
    setGeneratedTargets(null);
  };

  const handleAgeBasedGeneration = (): void => {
    if (!ageInput || isNaN(parseInt(ageInput))) {
      setMessage('Please enter a valid age');
      return;
    }
    generateDietChart('AGE_BASED', { age: parseInt(ageInput) });
  };

  const handleCkdStageGeneration = (): void => {
    if (!userProfile?.ckdStage) {
      setMessage('CKD stage not found in your profile. Please update your profile first.');
      return;
    }
    generateDietChart('CKD_STAGE');
  };

  const handleCustomValueChange = (field: keyof NutrientTargets, value: string): void => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) && value !== '') return;
    
    setCustomValues(prev => ({
      ...prev,
      [field]: numericValue || 0
    }));
  };

  const handleGenerateNew = (): void => {
    setShowGenerateNew(true);
    setSelectedMethod('');
    setGeneratedTargets(null);
    setMessage('');
  };

  const handleCancelGenerate = (): void => {
    setShowGenerateNew(false);
    setSelectedMethod('');
    setGeneratedTargets(null);
    setMessage('');
  };

  const nutrientLabels: Record<keyof NutrientTargets, string> = {
    protein: 'Protein (g)',
    calories: 'Calories (kcal)',
    carbohydrates: 'Carbohydrates (g)',
    fats: 'Fats (g)',
    potassium: 'Potassium (mg)',
    phosphorus: 'Phosphorus (mg)',
    sodium: 'Sodium (mg)',
    calcium: 'Calcium (mg)',
    magnesium: 'Magnesium (mg)',
    water: 'Water (ml)'
  };

  const formatCkdStage = (stage: string): string => {
    return stage.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isSuccessMessage = (msg: string): boolean => {
    return msg.includes('successfully') || msg.includes('generated');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-blue-600" />
            Diet Chart Generator
          </h1>
          <p className="text-gray-600 mt-2">
            Generate personalized diet charts based on your preferences and health conditions
          </p>
        </div>

        <div className="p-6">
          {/* Existing Diet Chart Display */}
          {userProfile?.dietChart && !showGenerateNew && (
            <div className="bg-blue-50 p-6 rounded-lg mb-6 border border-blue-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-blue-800 flex items-center gap-2">
                    <CheckCircle size={20} />
                    Your Current Diet Chart
                  </h3>
                  <p className="text-blue-600 text-sm mt-1 flex items-center gap-1">
                    <Calendar size={16} />
                    Last updated: {formatDate(userProfile.dietChart.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={handleGenerateNew}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  type="button"
                >
                  <RefreshCw size={16} />
                  Generate New
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.entries(userProfile.dietChart) as [string, any][])
                  .filter(([key]) => key !== '_id' && key !== 'userId' && key !== 'updatedAt')
                  .map(([key, value]) => (
                    <div key={key} className="bg-white p-3 rounded-md border border-blue-200">
                      <div className="text-sm text-gray-600">{nutrientLabels[key as keyof NutrientTargets]}</div>
                      <div className="text-lg font-semibold text-blue-700">{value}</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Show generate new section when no existing chart or user wants to generate new */}
          {(!userProfile?.dietChart || showGenerateNew) && (
            <>
              {/* Cancel button when generating new */}
              {userProfile?.dietChart && showGenerateNew && (
                <div className="mb-4">
                  <button
                    onClick={handleCancelGenerate}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                    type="button"
                  >
                    ← Back to Current Chart
                  </button>
                </div>
              )}

              {/* Method Selection */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">
                  {userProfile?.dietChart ? 'Generate New Diet Chart' : 'Choose Generation Method'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleMethodSelect('AGE_BASED')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedMethod === 'AGE_BASED'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    type="button"
                  >
                    <User className="mx-auto mb-2 text-blue-600" size={24} />
                    <h3 className="font-medium">Age Based</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Generate based on your age group
                    </p>
                  </button>

                  <button
                    onClick={() => handleMethodSelect('CKD_STAGE')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedMethod === 'CKD_STAGE'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    type="button"
                  >
                    <AlertCircle className="mx-auto mb-2 text-green-600" size={24} />
                    <h3 className="font-medium">CKD Stage</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Based on kidney disease stage
                    </p>
                  </button>

                  <button
                    onClick={() => handleMethodSelect('CUSTOM')}
                    className={`p-4 border-2 rounded-lg transition-all ${
                      selectedMethod === 'CUSTOM'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    type="button"
                  >
                    <Settings className="mx-auto mb-2 text-purple-600" size={24} />
                    <h3 className="font-medium">Custom Values</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Set your own nutrient targets
                    </p>
                  </button>
                </div>
              </div>

              {/* Age Based Form */}
              {selectedMethod === 'AGE_BASED' && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-4">Age Based Generation</h3>
                  <div className="flex items-center gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Age
                      </label>
                      <input
                        type="number"
                        value={ageInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgeInput(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your age"
                        min="1"
                        max="120"
                      />
                    </div>
                    <button
                      onClick={handleAgeBasedGeneration}
                      disabled={loading}
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      type="button"
                    >
                      {loading ? 'Generating...' : 'Generate Diet Chart'}
                    </button>
                  </div>
                </div>
              )}

              {/* CKD Stage Form */}
              {selectedMethod === 'CKD_STAGE' && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-4">CKD Stage Based Generation</h3>
                  {userProfile?.ckdStage ? (
                    <div>
                      <p className="text-gray-700 mb-4">
                        Your CKD Stage: <span className="font-medium">{formatCkdStage(userProfile.ckdStage)}</span>
                      </p>
                      <button
                        onClick={handleCkdStageGeneration}
                        disabled={loading}
                        className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                        type="button"
                      >
                        {loading ? 'Generating...' : 'Generate Diet Chart'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-amber-600">
                      <p>CKD stage not found in your profile. Please update your profile to use this option.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Custom Values Form */}
              {selectedMethod === 'CUSTOM' && (
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="text-lg font-medium mb-4">Custom Nutrient Targets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {(Object.entries(customValues) as [keyof NutrientTargets, number][]).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {nutrientLabels[key]}
                        </label>
                        <input
                          type="number"
                          value={value}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCustomValueChange(key, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="0.1"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={saveCustomValues}
                    disabled={loading}
                    className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 transition-colors"
                    type="button"
                  >
                    {loading ? 'Saving...' : 'Save Custom Diet Chart'}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              isSuccessMessage(message)
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {isSuccessMessage(message) ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                {message}
              </div>
            </div>
          )}

          {/* Generated Targets Display (for newly generated charts) */}
          {generatedTargets && showGenerateNew && (
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4 text-green-800">Your New Diet Chart Targets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.entries(generatedTargets) as [keyof NutrientTargets, number][]).map(([key, value]) => (
                  <div key={key} className="bg-white p-3 rounded-md border border-green-200">
                    <div className="text-sm text-gray-600">{nutrientLabels[key]}</div>
                    <div className="text-lg font-semibold text-green-700">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No diet chart message */}
          {!userProfile?.dietChart && !showGenerateNew && selectedMethod === '' && (
            <div className="text-center py-8 text-gray-500">
              <Activity size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">No diet chart found</p>
              <p className="text-sm">Choose a generation method above to create your personalized diet chart</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietChartGenerator;