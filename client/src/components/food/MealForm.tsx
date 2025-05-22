import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Droplet } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { FoodSearch } from './FoodSearch';
import { useFood } from '../../context/FoodContext';
import { Food, Meal } from '../../types';

const mealSchema = z.object({
  name: z.string().min(1, 'Meal name is required'),
  timeOfDay: z.string().optional(),
  waterIntake: z.number().min(0).optional(),
});

type MealFormData = z.infer<typeof mealSchema>;

interface MealFormProps {
  existingMeal?: Meal;
  onSave: (meal: Meal) => void;
  onCancel: () => void;
}

export const MealForm: React.FC<MealFormProps> = ({
  existingMeal,
  onSave,
  onCancel,
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: existingMeal?.name || '',
      timeOfDay: existingMeal?.timeOfDay || '',
      waterIntake: existingMeal?.waterIntake || 0,
    },
  });
  
  const [selectedFoods, setSelectedFoods] = useState<Array<{ food: Food; quantity: number }>>(
    existingMeal?.foods || []
  );
  
  const handleAddFood = (food: Food) => {
    const existingFoodIndex = selectedFoods.findIndex(f => f.food.id === food.id);
    
    if (existingFoodIndex >= 0) {
      // Increase quantity if food already exists
      const updatedFoods = [...selectedFoods];
      updatedFoods[existingFoodIndex] = {
        ...updatedFoods[existingFoodIndex],
        quantity: updatedFoods[existingFoodIndex].quantity + 1,
      };
      setSelectedFoods(updatedFoods);
    } else {
      // Add new food
      setSelectedFoods([...selectedFoods, { food, quantity: 1 }]);
    }
  };
  
  const handleUpdateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedFoods(selectedFoods.filter(f => f.food.id !== foodId));
    } else {
      setSelectedFoods(
        selectedFoods.map(f => 
          f.food.id === foodId ? { ...f, quantity } : f
        )
      );
    }
  };
  
  const handleRemoveFood = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter(f => f.food.id !== foodId));
  };
  
  const onSubmit = (data: MealFormData) => {
    const meal: Meal = {
      id: existingMeal?.id || Date.now().toString(),
      name: data.name,
      foods: selectedFoods,
      timeOfDay: data.timeOfDay,
      waterIntake: data.waterIntake,
    };
    
    onSave(meal);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              {existingMeal ? 'Edit Meal' : 'Create New Meal'}
            </h3>
            
            <Card>
              <CardContent className="p-4 space-y-4">
                <Input
                  label="Meal Name"
                  placeholder="e.g., Breakfast, Lunch, Dinner"
                  error={errors.name?.message}
                  {...register('name')}
                />
                
                <Input
                  label="Time of Day"
                  placeholder="e.g., 8:00 AM"
                  {...register('timeOfDay')}
                />
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Water Intake (ml)
                  </label>
                  <div className="flex items-center">
                    <Droplet className="h-5 w-5 text-secondary-400 mr-2" />
                    <Input
                      type="number"
                      min="0"
                      placeholder="e.g., 250"
                      {...register('waterIntake', { valueAsNumber: true })}
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-neutral-700 mb-2">Selected Foods</h4>
                  
                  {selectedFoods.length === 0 ? (
                    <div className="text-neutral-500 text-sm py-4 text-center border border-dashed border-neutral-300 rounded-md">
                      No foods added yet. Search and add foods from the right panel.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                      {selectedFoods.map(({ food, quantity }) => (
                        <div
                          key={food.id}
                          className="flex items-center justify-between p-2 bg-neutral-50 rounded-md border border-neutral-200"
                        >
                          <div>
                            <p className="font-medium text-neutral-800">{food.name}</p>
                            <p className="text-xs text-neutral-500">
                              {food.servingSize} {food.servingSizeUnit}
                            </p>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <button
                                type="button"
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-neutral-200 text-neutral-700"
                                onClick={() => handleUpdateQuantity(food.id, quantity - 1)}
                              >
                                -
                              </button>
                              <span className="w-8 text-center">{quantity}</span>
                              <button
                                type="button"
                                className="w-7 h-7 flex items-center justify-center rounded-md bg-primary-500 text-white"
                                onClick={() => handleUpdateQuantity(food.id, quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              type="button"
                              className="text-error-500 hover:text-error-600"
                              onClick={() => handleRemoveFood(food.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  icon={<Plus className="h-4 w-4" />}
                >
                  {existingMeal ? 'Update Meal' : 'Save Meal'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Add Foods to Your Meal
            </h3>
            <FoodSearch onSelectFood={handleAddFood} />
          </div>
        </div>
      </form>
    </div>
  );
};