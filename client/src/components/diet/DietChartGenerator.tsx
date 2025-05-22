import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Calculator, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { useDiet } from '../../context/DietContext';
import { useAuth } from '../../context/AuthContext';
import { DietChartMethod, NutrientTarget } from '../../types';

export const DietChartGenerator: React.FC = () => {
  const { nutrientTargets, generateDietChart, updateNutrientTargets } = useDiet();
  const { user } = useAuth();
  const [method, setMethod] = useState<DietChartMethod>(DietChartMethod.CKD_STAGE);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [customValues, setCustomValues] = useState<Partial<NutrientTarget>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleMethodChange = (value: string) => {
    setMethod(value as DietChartMethod);
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAge(parseInt(e.target.value, 10) || undefined);
  };

  const handleCustomValueChange = (key: keyof NutrientTarget, value: number) => {
    setCustomValues({
      ...customValues,
      [key]: value,
    });
  };

  const handleGenerateChart = () => {
    if (method === DietChartMethod.CUSTOM && Object.keys(customValues).length > 0) {
      updateNutrientTargets(customValues);
    } else {
      generateDietChart(method, age);
    }
    setIsEditing(false);
  };

  const nutrients = [
    { key: 'protein', name: 'Protein', unit: 'g' },
    { key: 'calories', name: 'Calories', unit: 'kcal' },
    { key: 'carbohydrates', name: 'Carbohydrates', unit: 'g' },
    { key: 'fats', name: 'Fats', unit: 'g' },
    { key: 'potassium', name: 'Potassium', unit: 'mg' },
    { key: 'phosphorus', name: 'Phosphorus', unit: 'mg' },
    { key: 'sodium', name: 'Sodium', unit: 'mg' },
    { key: 'calcium', name: 'Calcium', unit: 'mg' },
    { key: 'magnesium', name: 'Magnesium', unit: 'mg' },
    { key: 'water', name: 'Water', unit: 'ml' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-900">Your Personalized Diet Chart</h2>
          <p className="text-neutral-600 mt-1">
            Set your daily nutrient targets based on your health needs
          </p>
        </div>

        {isEditing ? (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-neutral-800">
                Generate Your Diet Chart
              </h3>
            </CardHeader>
            <CardContent>
              <Select
                label="Select Method"
                options={Object.values(DietChartMethod).map((method) => ({
                  value: method,
                  label: method,
                }))}
                value={method}
                onChange={handleMethodChange}
              />

              {method === DietChartMethod.AGE_BASED && (
                <Input
                  label="Your Age"
                  type="number"
                  min="18"
                  max="100"
                  placeholder="Enter your age"
                  value={age || ''}
                  onChange={handleAgeChange}
                />
              )}

              {method === DietChartMethod.CUSTOM && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {nutrients.map((nutrient) => (
                    <Input
                      key={nutrient.key}
                      label={`${nutrient.name} (${nutrient.unit})`}
                      type="number"
                      min="0"
                      placeholder={`Enter target ${nutrient.name.toLowerCase()}`}
                      value={
                        customValues[nutrient.key as keyof NutrientTarget] !== undefined
                          ? customValues[nutrient.key as keyof NutrientTarget]
                          : ''
                      }
                      onChange={(e) =>
                        handleCustomValueChange(
                          nutrient.key as keyof NutrientTarget,
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleGenerateChart}
                icon={<Calculator className="h-4 w-4" />}
              >
                Generate Chart
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <h3 className="text-lg font-semibold text-neutral-800">
                Your Daily Nutrient Targets
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                icon={<Settings className="h-4 w-4" />}
              >
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {nutrients.map((nutrient) => (
                  <div
                    key={nutrient.key}
                    className="bg-neutral-50 rounded-lg p-4 border border-neutral-200"
                  >
                    <h4 className="text-sm font-medium text-neutral-500">{nutrient.name}</h4>
                    <div className="mt-1 flex justify-between items-baseline">
                      <span className="text-2xl font-bold text-neutral-900">
                        {nutrientTargets[nutrient.key as keyof NutrientTarget]}
                      </span>
                      <span className="text-sm text-neutral-500">{nutrient.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-neutral-600 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </CardFooter>
          </Card>
        )}
      </motion.div>
    </div>
  );
};