import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, Utensils, Activity, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { NutrientChart } from '../components/food/NutrientChart';
import { useAuth } from '../context/AuthContext';
import { useDiet } from '../context/DietContext';
import { useFood } from '../context/FoodContext';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { nutrientTargets } = useDiet();
  const { dailyIntakes, meals } = useFood();
  
  // Get today's intake or create an empty one
  const today = new Date().toISOString().split('T')[0];
  const todayIntake = dailyIntakes.find(di => di.date === today);
  
  // Calculate percentages for key nutrients
  const calculatePercentage = (actual: number, target: number) => {
    return Math.min(Math.round((actual / target) * 100), 100);
  };
  
  const keyNutrients = [
    {
      name: 'Protein',
      actual: todayIntake ? todayIntake.totalNutrients.protein : 0,
      target: nutrientTargets.protein,
      unit: 'g',
      icon: <Activity className="h-5 w-5 text-primary-500" />,
    },
    {
      name: 'Potassium',
      actual: todayIntake ? todayIntake.totalNutrients.potassium : 0,
      target: nutrientTargets.potassium,
      unit: 'mg',
      icon: <Utensils className="h-5 w-5 text-accent-500" />,
    },
    {
      name: 'Water',
      actual: todayIntake ? todayIntake.totalNutrients.water : 0,
      target: nutrientTargets.water,
      unit: 'ml',
      icon: <Droplet className="h-5 w-5 text-secondary-400" />,
    },
  ];
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          Welcome, {user?.name || 'User'}
        </h1>
        <p className="text-neutral-600 mt-1">
          Track your kidney health and nutrition all in one place
        </p>
      </div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        {keyNutrients.map((nutrient) => {
          const percentage = calculatePercentage(nutrient.actual, nutrient.target);
          
          return (
            <motion.div key={nutrient.name} variants={item}>
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-900">
                        {nutrient.name}
                      </h3>
                      <p className="text-sm text-neutral-500">Daily Target</p>
                    </div>
                    <div className="bg-neutral-100 p-2 rounded-full">
                      {nutrient.icon}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="w-full bg-neutral-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
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
                  
                  <div className="flex justify-between items-baseline">
                    <div className="text-2xl font-bold text-neutral-900">
                      {nutrient.actual} <span className="text-sm font-normal text-neutral-500">{nutrient.unit}</span>
                    </div>
                    <div className="text-sm text-neutral-500">
                      of {nutrient.target} {nutrient.unit} ({percentage}%)
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="lg:col-span-2"
        >
          <NutrientChart />
        </motion.div>
        
        <motion.div variants={item} initial="hidden" animate="show">
          <Card className="h-full">
            <CardContent className="p-6 flex flex-col h-full">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Quick Actions
              </h3>
              
              <div className="space-y-3 mb-6">
                <Link to="/diet-chart">
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<Activity className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    View Diet Chart
                  </Button>
                </Link>
                <Link to="/meals">
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<Utensils className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    Manage Meals
                  </Button>
                </Link>
                <Link to="/tracking">
                  <Button
                    variant="outline"
                    fullWidth
                    icon={<Calendar className="h-4 w-4" />}
                    iconPosition="left"
                  >
                    Track Nutrients
                  </Button>
                </Link>
              </div>
              
              <h3 className="text-lg font-semibold text-neutral-900 mb-4 mt-auto">
                Your Saved Meals
              </h3>
              
              {meals.length > 0 ? (
                <div className="space-y-3">
                  {meals.slice(0, 3).map((meal) => (
                    <div
                      key={meal.id}
                      className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg border border-neutral-200"
                    >
                      <div>
                        <h4 className="font-medium text-neutral-800">{meal.name}</h4>
                        <p className="text-xs text-neutral-500">
                          {meal.foods.length} items
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-neutral-400" />
                    </div>
                  ))}
                  
                  {meals.length > 3 && (
                    <Link to="/meals">
                      <p className="text-center text-sm text-primary-500 mt-2">
                        View all meals
                      </p>
                    </Link>
                  )}
                </div>
              ) : (
                <div className="text-center text-neutral-500 bg-neutral-50 p-4 rounded-lg border border-dashed border-neutral-300">
                  <p>No saved meals yet</p>
                  <Link to="/meals">
                    <Button variant="primary" size="sm" className="mt-2">
                      Create Meal
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};