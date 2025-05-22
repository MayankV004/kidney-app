import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Book, Search, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { MealForm } from '../components/food/MealForm';
import { useFood } from '../context/FoodContext';
import { Meal } from '../types';

export const MealsPage: React.FC = () => {
  const { meals, addMeal, updateMeal, deleteMeal, addToDailyIntake } = useFood();
  const [isCreating, setIsCreating] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleCreateMeal = () => {
    setIsCreating(true);
    setEditingMeal(null);
  };
  
  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setIsCreating(true);
  };
  
  const handleSaveMeal = (meal: Meal) => {
    if (editingMeal) {
      updateMeal(meal.id, meal);
    } else {
      addMeal(meal);
    }
    setIsCreating(false);
    setEditingMeal(null);
  };
  
  const handleCancelEdit = () => {
    setIsCreating(false);
    setEditingMeal(null);
  };
  
  const handleDeleteMeal = (id: string) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      deleteMeal(id);
    }
  };
  
  const handleLogMeal = (meal: Meal) => {
    addToDailyIntake(meal);
    alert('Meal added to today\'s intake!');
  };
  
  const filteredMeals = searchTerm
    ? meals.filter(meal => 
        meal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meal.foods.some(f => f.food.name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : meals;
  
  if (isCreating) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            {editingMeal ? 'Edit Meal' : 'Create New Meal'}
          </h1>
          <Button
            variant="outline"
            onClick={handleCancelEdit}
            icon={<X className="h-4 w-4" />}
          >
            Cancel
          </Button>
        </div>
        
        <MealForm
          existingMeal={editingMeal || undefined}
          onSave={handleSaveMeal}
          onCancel={handleCancelEdit}
        />
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto px-4 py-8 sm:px-6"
    >
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Meal Management
          </h1>
          <p className="text-neutral-600 mt-1">
            Create, edit and log your favorite meals
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreateMeal}
          icon={<Plus className="h-4 w-4" />}
        >
          Create New Meal
        </Button>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="h-5 w-5 text-neutral-400" />}
        />
      </div>
      
      {filteredMeals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => (
            <Card key={meal.id} className="h-full">
              <CardHeader className="pb-3">
                <h3 className="text-lg font-semibold text-neutral-900">{meal.name}</h3>
                {meal.timeOfDay && (
                  <p className="text-sm text-neutral-500">{meal.timeOfDay}</p>
                )}
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  {meal.foods.length > 0 ? (
                    meal.foods.map(({ food, quantity }) => (
                      <div
                        key={food.id}
                        className="flex justify-between items-center p-2 bg-neutral-50 rounded-md text-sm"
                      >
                        <span className="font-medium text-neutral-800">{food.name}</span>
                        <span className="text-neutral-600">x{quantity}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-neutral-500 text-sm">No foods added to this meal</p>
                  )}
                </div>
                
                {meal.waterIntake && meal.waterIntake > 0 && (
                  <div className="flex items-center text-sm text-neutral-600 mb-4">
                    <Droplet className="h-4 w-4 text-secondary-400 mr-1" />
                    <span>Water: {meal.waterIntake} ml</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between w-full">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMeal(meal.id)}
                    icon={<Trash2 className="h-4 w-4" />}
                    className="text-error-500 hover:text-error-600 hover:bg-error-50"
                  >
                    Delete
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditMeal(meal)}
                      icon={<Edit className="h-4 w-4" />}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleLogMeal(meal)}
                      icon={<Book className="h-4 w-4" />}
                    >
                      Log
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-neutral-50 rounded-lg border border-dashed border-neutral-300">
          <Book className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-1">No meals found</h3>
          <p className="text-neutral-600 mb-4">
            {searchTerm
              ? `No meals matching "${searchTerm}"`
              : "You haven't created any meals yet"}
          </p>
          <Button
            variant="primary"
            onClick={handleCreateMeal}
            icon={<Plus className="h-4 w-4" />}
          >
            Create Your First Meal
          </Button>
        </div>
      )}
    </motion.div>
  );
};