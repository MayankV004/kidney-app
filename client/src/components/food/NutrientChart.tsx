import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { useFood } from '../../context/FoodContext';
import { useDiet } from '../../context/DietContext';

export const NutrientChart: React.FC = () => {
  const { dailyIntakes } = useFood();
  const { nutrientTargets } = useDiet();
  
  // Get today's intake or create an empty one
  const today = new Date().toISOString().split('T')[0];
  const todayIntake = dailyIntakes.find(di => di.date === today);
  
  const getPercentage = (actual: number, target: number) => {
    return Math.min(Math.round((actual / target) * 100), 100);
  };
  
  // Prepare data for the chart
  const chartData = [
    {
      name: 'Protein',
      actual: todayIntake ? todayIntake.totalNutrients.protein : 0,
      target: nutrientTargets.protein,
      percentage: getPercentage(
        todayIntake ? todayIntake.totalNutrients.protein : 0,
        nutrientTargets.protein
      ),
    },
    {
      name: 'Carbs',
      actual: todayIntake ? todayIntake.totalNutrients.carbohydrates : 0,
      target: nutrientTargets.carbohydrates,
      percentage: getPercentage(
        todayIntake ? todayIntake.totalNutrients.carbohydrates : 0,
        nutrientTargets.carbohydrates
      ),
    },
    {
      name: 'Fats',
      actual: todayIntake ? todayIntake.totalNutrients.fats : 0,
      target: nutrientTargets.fats,
      percentage: getPercentage(
        todayIntake ? todayIntake.totalNutrients.fats : 0,
        nutrientTargets.fats
      ),
    },
    {
      name: 'Potassium',
      actual: todayIntake ? todayIntake.totalNutrients.potassium : 0,
      target: nutrientTargets.potassium,
      percentage: getPercentage(
        todayIntake ? todayIntake.totalNutrients.potassium : 0,
        nutrientTargets.potassium
      ),
    },
    {
      name: 'Phosphorus',
      actual: todayIntake ? todayIntake.totalNutrients.phosphorus : 0,
      target: nutrientTargets.phosphorus,
      percentage: getPercentage(
        todayIntake ? todayIntake.totalNutrients.phosphorus : 0,
        nutrientTargets.phosphorus
      ),
    },
    {
      name: 'Sodium',
      actual: todayIntake ? todayIntake.totalNutrients.sodium : 0,
      target: nutrientTargets.sodium,
      percentage: getPercentage(
        todayIntake ? todayIntake.totalNutrients.sodium : 0,
        nutrientTargets.sodium
      ),
    },
  ];
  
  // Prepare data for water intake
  const waterData = {
    actual: todayIntake ? todayIntake.totalNutrients.water : 0,
    target: nutrientTargets.water,
    percentage: getPercentage(
      todayIntake ? todayIntake.totalNutrients.water : 0,
      nutrientTargets.water
    ),
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <h3 className="text-lg font-semibold text-neutral-900">Daily Nutrient Intake</h3>
        <p className="text-sm text-neutral-600">
          {today} - Progress toward your daily targets
        </p>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'target') return [`${value}`, 'Target'];
                  if (name === 'actual') return [`${value}`, 'Actual'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar dataKey="actual" fill="#4A8DD5" name="Actual" />
              <Bar dataKey="target" fill="#8D6CD9" name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-6">
          <h4 className="text-md font-medium text-neutral-800 mb-2">Water Intake</h4>
          <div className="flex items-center">
            <div className="w-full bg-neutral-200 rounded-full h-4 mr-4">
              <div
                className="bg-secondary-400 h-4 rounded-full"
                style={{ width: `${waterData.percentage}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-neutral-700 whitespace-nowrap">
              {waterData.actual} / {waterData.target} ml
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          {chartData.map((item) => (
            <div key={item.name} className="bg-neutral-50 p-3 rounded-md border border-neutral-200">
              <h5 className="text-sm font-medium text-neutral-700">{item.name}</h5>
              <div className="flex justify-between mt-1">
                <span className="text-sm text-neutral-800">
                  {item.actual} / {item.target}
                </span>
                <span
                  className={`text-sm font-medium ${
                    item.percentage > 90
                      ? 'text-error-500'
                      : item.percentage > 70
                      ? 'text-warning-500'
                      : 'text-success-500'
                  }`}
                >
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};