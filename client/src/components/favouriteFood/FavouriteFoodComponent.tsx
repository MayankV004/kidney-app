import React, { useState, useEffect } from 'react';
import { Heart, Utensils, Scale, Zap, Droplets } from 'lucide-react';
import { NavLink } from 'react-router-dom';

interface FoodNutrients {
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

interface Food {
  _id: string;
  name: string;
  category: 'VEGETABLES' | 'FRUITS' | 'GRAINS' | 'PROTEIN' | 'DAIRY' | 'BEVERAGES' | 'SNACKS' | 'OTHER';
  servingSize: number;
  servingSizeUnit: string;
  nutrients: FoodNutrients;
  isKidneyFriendly: boolean;
  createdAt: string;
}

interface UserProfile {
  _id: string;
  email: string;
  name?: string;
  // Add other profile fields as needed
}

const FavouriteFoodComponent: React.FC = () => {
  const [favoriteFoods, setFavoriteFoods] = useState<Food[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserProfileAndFavorites();
  }, []);

  const handleLogout = (): void => {
    localStorage.removeItem('token');
    // Redirect to login or handle logout logic
    window.location.href = '/login';
  };

  const fetchUserProfile = async (): Promise<UserProfile | null> => {
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

      console.log(response);
      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return null;
        }
        throw new Error(`Failed to fetch profile: ${response.status}`);
      }

      const userData: UserProfile = await response.json();
      console.log(userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  };

  const fetchFavoriteFoods = async (userId: string): Promise<Food[]> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('http://localhost:5000/api/user/favorites', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return [];
        }
        throw new Error(`Failed to fetch favorite foods: ${response.status}`);
      }

      const data: Food[] = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching favorite foods:', error);
      throw error;
    }
  };

  const fetchUserProfileAndFavorites = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      // First fetch user profile to get userId
      const userData = await fetchUserProfile();
      if (!userData) return;

      setUserProfile(userData);

      // Then fetch favorite foods using the userId
      const favorites = await fetchFavoriteFoods(userData._id);
      setFavoriteFoods(favorites);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: Food['category']): string => {
    const colors: Record<Food['category'], string> = {
      VEGETABLES: 'bg-green-100 text-green-800',
      FRUITS: 'bg-orange-100 text-orange-800',
      GRAINS: 'bg-amber-100 text-amber-800',
      PROTEIN: 'bg-red-100 text-red-800',
      DAIRY: 'bg-blue-100 text-blue-800',
      BEVERAGES: 'bg-cyan-100 text-cyan-800',
      SNACKS: 'bg-purple-100 text-purple-800',
      OTHER: 'bg-gray-100 text-gray-800'
    };
    return colors[category];
  };

  const formatNutrient = (value: number, unit: string = ''): string => {
    return value > 0 ? `${value}${unit}` : 'N/A';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg text-gray-600">Loading your favorite foods...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error loading favorites</div>
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchUserProfileAndFavorites}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-3xl font-bold text-gray-900">My Favorite Foods</h1>
        </div>
        <p className="text-gray-600">
          {userProfile?.name ? `${userProfile.name}'s` : 'Your'} personalized collection of favorite foods
        </p>
      </div>

      {favoriteFoods.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
            <Utensils className="h-12 w-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No favorites yet</h2>
          <p className="text-gray-500 mb-6">Start exploring and add foods to your favorites to see them here!</p>
          <NavLink to="/food">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Browse Foods
          </button>
          </NavLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteFoods.map((food: Food) => (
            <div key={food._id} className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{food.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(food.category)}`}>
                      {food.category.toLowerCase().replace('_', ' ')}
                    </span>
                  </div>
                  <Heart className="h-6 w-6 text-red-500 fill-current flex-shrink-0 ml-2" />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Scale className="h-4 w-4" />
                    <span>Serving: {food.servingSize} {food.servingSizeUnit}</span>
                  </div>
                  
                  {food.isKidneyFriendly && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700 font-medium">Kidney Friendly</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Nutritional Info</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-orange-500" />
                      <span className="text-gray-600">Calories:</span>
                      <span className="font-medium">{formatNutrient(food.nutrients.calories)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Protein:</span>
                      <span className="font-medium">{formatNutrient(food.nutrients.protein, 'g')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Carbs:</span>
                      <span className="font-medium">{formatNutrient(food.nutrients.carbohydrates, 'g')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-600">Fats:</span>
                      <span className="font-medium">{formatNutrient(food.nutrients.fats, 'g')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3 w-3 text-blue-400" />
                      <span className="text-gray-600">Water:</span>
                      <span className="font-medium">{formatNutrient(food.nutrients.water, 'g')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">Sodium:</span>
                      <span className="font-medium">{formatNutrient(food.nutrients.sodium, 'mg')}</span>
                    </div>
                  </div>
                </div>

                
              </div>
            </div>
          ))}
        </div>
      )}

      {favoriteFoods.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-gray-500">
            Showing {favoriteFoods.length} favorite food{favoriteFoods.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default FavouriteFoodComponent;