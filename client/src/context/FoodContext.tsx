import React, { createContext, useContext, useState, useEffect } from 'react';
import { Food, Meal, DailyIntake, FoodCategory } from '../types';
import { mockFoods } from '../data/mockFoods';

interface FoodContextType {
  foods: Food[];
  meals: Meal[];
  dailyIntakes: DailyIntake[];
  favoriteFoods: Food[];
  recentSearches: Food[];
  searchFoods: (query: string) => Food[];
  addFood: (food: Food) => void;
  addMeal: (meal: Meal) => void;
  updateMeal: (id: string, meal: Partial<Meal>) => void;
  deleteMeal: (id: string) => void;
  addFoodToMeal: (mealId: string, food: Food, quantity: number) => void;
  removeFoodFromMeal: (mealId: string, foodId: string) => void;
  toggleFavoriteFood: (food: Food) => void;
  addToDailyIntake: (meal: Meal) => void;
}

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [foods, setFoods] = useState<Food[]>(mockFoods);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [dailyIntakes, setDailyIntakes] = useState<DailyIntake[]>([]);
  const [favoriteFoods, setFavoriteFoods] = useState<Food[]>([]);
  const [recentSearches, setRecentSearches] = useState<Food[]>([]);

  useEffect(() => {
    const storedMeals = localStorage.getItem('meals');
    const storedFavorites = localStorage.getItem('favoriteFoods');
    const storedRecent = localStorage.getItem('recentSearches');
    const storedIntakes = localStorage.getItem('dailyIntakes');

    if (storedMeals) setMeals(JSON.parse(storedMeals));
    if (storedFavorites) setFavoriteFoods(JSON.parse(storedFavorites));
    if (storedRecent) setRecentSearches(JSON.parse(storedRecent));
    if (storedIntakes) setDailyIntakes(JSON.parse(storedIntakes));
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('favoriteFoods', JSON.stringify(favoriteFoods));
  }, [favoriteFoods]);

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem('dailyIntakes', JSON.stringify(dailyIntakes));
  }, [dailyIntakes]);

  const searchFoods = (query: string): Food[] => {
    const results = foods.filter(food => 
      food.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Add to recent searches if not already there
    if (query && results.length > 0) {
      const firstResult = results[0];
      if (!recentSearches.some(f => f.id === firstResult.id)) {
        const newRecentSearches = [firstResult, ...recentSearches].slice(0, 10);
        setRecentSearches(newRecentSearches);
      }
    }
    
    return results;
  };

  const addFood = (food: Food) => {
    setFoods(prev => [...prev, food]);
  };

  const addMeal = (meal: Meal) => {
    setMeals(prev => [...prev, meal]);
  };

  const updateMeal = (id: string, updatedMeal: Partial<Meal>) => {
    setMeals(prev => 
      prev.map(meal => 
        meal.id === id ? { ...meal, ...updatedMeal } : meal
      )
    );
  };

  const deleteMeal = (id: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== id));
  };

  const addFoodToMeal = (mealId: string, food: Food, quantity: number) => {
    setMeals(prev => 
      prev.map(meal => {
        if (meal.id === mealId) {
          const existingFoodIndex = meal.foods.findIndex(f => f.food.id === food.id);
          
          if (existingFoodIndex >= 0) {
            // Update quantity if food already exists in meal
            const updatedFoods = [...meal.foods];
            updatedFoods[existingFoodIndex] = { 
              ...updatedFoods[existingFoodIndex], 
              quantity: updatedFoods[existingFoodIndex].quantity + quantity 
            };
            return { ...meal, foods: updatedFoods };
          } else {
            // Add new food to meal
            return { ...meal, foods: [...meal.foods, { food, quantity }] };
          }
        }
        return meal;
      })
    );
  };

  const removeFoodFromMeal = (mealId: string, foodId: string) => {
    setMeals(prev => 
      prev.map(meal => {
        if (meal.id === mealId) {
          return { 
            ...meal, 
            foods: meal.foods.filter(f => f.food.id !== foodId) 
          };
        }
        return meal;
      })
    );
  };

  const toggleFavoriteFood = (food: Food) => {
    const isFavorite = favoriteFoods.some(f => f.id === food.id);
    
    if (isFavorite) {
      setFavoriteFoods(prev => prev.filter(f => f.id !== food.id));
    } else {
      setFavoriteFoods(prev => [...prev, food]);
    }
  };

  const addToDailyIntake = (meal: Meal) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate total nutrients for this meal
    const mealNutrients = meal.foods.reduce((total, { food, quantity }) => {
      return {
        protein: total.protein + (food.nutrients.protein * quantity),
        calories: total.calories + (food.nutrients.calories * quantity),
        carbohydrates: total.carbohydrates + (food.nutrients.carbohydrates * quantity),
        fats: total.fats + (food.nutrients.fats * quantity),
        potassium: total.potassium + (food.nutrients.potassium * quantity),
        phosphorus: total.phosphorus + (food.nutrients.phosphorus * quantity),
        sodium: total.sodium + (food.nutrients.sodium * quantity),
        calcium: total.calcium + (food.nutrients.calcium * quantity),
        magnesium: total.magnesium + (food.nutrients.magnesium * quantity),
        water: total.water + (meal.waterIntake || 0)
      };
    }, {
      protein: 0,
      calories: 0,
      carbohydrates: 0,
      fats: 0,
      potassium: 0,
      phosphorus: 0,
      sodium: 0,
      calcium: 0,
      magnesium: 0,
      water: meal.waterIntake || 0
    });
    
    // Check if we already have an entry for today
    const todayIntakeIndex = dailyIntakes.findIndex(di => di.date === today);
    
    if (todayIntakeIndex >= 0) {
      // Update existing entry
      const updatedIntakes = [...dailyIntakes];
      const currentIntake = updatedIntakes[todayIntakeIndex];
      
      updatedIntakes[todayIntakeIndex] = {
        ...currentIntake,
        meals: [...currentIntake.meals, meal],
        totalNutrients: {
          protein: currentIntake.totalNutrients.protein + mealNutrients.protein,
          calories: currentIntake.totalNutrients.calories + mealNutrients.calories,
          carbohydrates: currentIntake.totalNutrients.carbohydrates + mealNutrients.carbohydrates,
          fats: currentIntake.totalNutrients.fats + mealNutrients.fats,
          potassium: currentIntake.totalNutrients.potassium + mealNutrients.potassium,
          phosphorus: currentIntake.totalNutrients.phosphorus + mealNutrients.phosphorus,
          sodium: currentIntake.totalNutrients.sodium + mealNutrients.sodium,
          calcium: currentIntake.totalNutrients.calcium + mealNutrients.calcium,
          magnesium: currentIntake.totalNutrients.magnesium + mealNutrients.magnesium,
          water: currentIntake.totalNutrients.water + mealNutrients.water
        }
      };
      
      setDailyIntakes(updatedIntakes);
    } else {
      // Create new entry for today
      setDailyIntakes([...dailyIntakes, {
        date: today,
        meals: [meal],
        totalNutrients: mealNutrients
      }]);
    }
  };

  return (
    <FoodContext.Provider
      value={{
        foods,
        meals,
        dailyIntakes,
        favoriteFoods,
        recentSearches,
        searchFoods,
        addFood,
        addMeal,
        updateMeal,
        deleteMeal,
        addFoodToMeal,
        removeFoodFromMeal,
        toggleFavoriteFood,
        addToDailyIntake,
      }}
    >
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (context === undefined) {
    throw new Error('useFood must be used within a FoodProvider');
  }
  return context;
};