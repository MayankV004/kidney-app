import React from 'react';
import { motion } from 'framer-motion';
import { NutrientChart } from '../components/food/NutrientChart';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { useFood } from '../context/FoodContext';
import { useDiet } from '../context/DietContext';
import { Calendar, Clock } from 'lucide-react';

export const TrackingPage: React.FC = () => {
  const { dailyIntakes } = useFood();
  const { nutrientTargets } = useDiet();
  
  // Get today's intake
  const today = new Date().toISOString().split('T')[0];
  const todayIntake = dailyIntakes.find(di => di.date === today);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8 sm:px-6"
    >
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Nutrient Tracking
        </h1>
        <p className="text-neutral-600 mt-1">
          Monitor your daily nutrient intake and compare with your targets
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <NutrientChart />
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">Today's Meals</h3>
              <div className="flex items-center text-sm text-neutral-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{today}</span>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {todayIntake && todayIntake.meals.length > 0 ? (
              <div className="space-y-4">
                {todayIntake.meals.map((meal, index) => (
                  <div key={index} className="border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-neutral-800">{meal.name}</h4>
                      {meal.timeOfDay && (
                        <div className="flex items-center text-xs text-neutral-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{meal.timeOfDay}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-1 mb-2">
                      {meal.foods.map(({ food, quantity }) => (
                        <div
                          key={food.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-neutral-700">
                            {food.name} x{quantity}
                          </span>
                          <span className="text-neutral-500">
                            {food.nutrients.calories * quantity} kcal
                          </span>
                        </div>
                      ))}
                    </div>
                    
                    {meal.waterIntake && meal.waterIntake > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-700">Water</span>
                        <span className="text-neutral-500">{meal.waterIntake} ml</span>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="border-t border-neutral-200 pt-4 mt-4">
                  <div className="flex justify-between font-medium">
                    <span className="text-neutral-800">Total Calories</span>
                    <span className="text-neutral-800">
                      {todayIntake.totalNutrients.calories} / {nutrientTargets.calories} kcal
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-neutral-500">
                <p>No meals logged for today</p>
                <p className="text-sm mt-1">Add meals from the Meals page to track your intake</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-neutral-900">Nutrient Summary</h3>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {todayIntake ? (
              Object.entries(todayIntake.totalNutrients).map(([nutrient, value]) => {
                if (nutrient === 'water') return null; // Skip water as it's displayed elsewhere
                
                const target = nutrientTargets[nutrient as keyof typeof nutrientTargets];
                const percentage = Math.min(Math.round((value / target) * 100), 100);
                
                return (
                  <div key={nutrient} className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                    <h4 className="text-sm font-medium text-neutral-700 capitalize">{nutrient}</h4>
                    <div className="mt-2 mb-1">
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            percentage > 90
                              ? 'bg-error-500'
                              : percentage > 70
                              ? 'bg-warning-500'
                              : 'bg-success-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>{value} {nutrient === 'calories' ? 'kcal' : 'g'}</span>
                      <span className="text-neutral-500">{percentage}%</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-4 text-center py-8 text-neutral-500">
                <p>No nutrient data available for today</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};