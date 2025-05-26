import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, TooltipProps,ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, Target, TrendingUp, Calendar } from 'lucide-react';

const NutrientDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyIntake, setDailyIntake] = useState(null);
  const [nutrientTargets, setNutrientTargets] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  

  useEffect(() => {
    // Simulate API calls
    const fetchData = async () => {
      try {
    const token = localStorage.getItem("token");

        setLoading(true);
        // In real implementation, replace with actual API calls:
        const intakeResponse = await fetch(`http://localhost:5000/api/daily-intake?date=${selectedDate}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
        const targetsResponse = await fetch(`http://localhost:5000/api/nutrient-targets`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const intake=await intakeResponse.json()
        console.log(intake);
        
        const target=await targetsResponse.json()
        console.log(target);
        setDailyIntake(intake);
        setNutrientTargets(target);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      </div>
    );
  }

  const calculateNutrientData = () => {
    const nutrients = Object.keys(nutrientTargets|| {});
    return nutrients.map(nutrient => {
      const consumed = dailyIntake?.totalNutrients?.[nutrient] || 0;
      const target = nutrientTargets[nutrient];
      const percentage = Math.round((consumed / target) * 100);
      const remaining = Math.max(0, target - consumed);
      const exceeded = consumed > target;

      return {
        name: nutrient.charAt(0).toUpperCase() + nutrient.slice(1),
        consumed,
        target,
        remaining,
        percentage,
        exceeded,
        unit: getNutrientUnit(nutrient)
      };
    });
  };

  const nutrientKeys = [
    'protein',
    'calories',
    'carbohydrates',
    'fats',
    'potassium',
    'phosphorus',
    'sodium',
    'calcium',
    'magnesium',
    'water'
  ] as const;
  type NutrientKey = typeof nutrientKeys[number];

  const getNutrientUnit = (nutrient: string) => {
    const units: Record<NutrientKey, string> = {
      protein: 'g',
      calories: 'kcal',
      carbohydrates: 'g',
      fats: 'g',
      potassium: 'mg',
      phosphorus: 'mg',
      sodium: 'mg',
      calcium: 'mg',
      magnesium: 'mg',
      water: 'ml'
    };
    return units[nutrient as NutrientKey] || '';
  };

  const nutrientData = calculateNutrientData();
  const exceededNutrients = nutrientData.filter(n => n.exceeded);

  const pieChartData = nutrientData.slice(0, 4).map(n => ({
    name: n.name,
    value: n.consumed,
    target: n.target,
    percentage: n.percentage
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'];

  const CustomTooltip = ({ active, payload, label }: TooltipProps<any, any>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{`${data.name}`}</p>
          <p className="text-blue-600">{`Consumed: ${data.consumed} ${data.unit}`}</p>
          <p className="text-gray-600">{`Target: ${data.target} ${data.unit}`}</p>
          <p className="text-green-600">{`Progress: ${data.percentage}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <Target className="text-blue-600" />
              Daily Nutrient Intake Dashboard
            </h1>
            <div className="flex items-center gap-2">
              <Calendar className="text-gray-600" size={20} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Exceeded Nutrients Alert */}
          {exceededNutrients.length > 0 && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex items-center">
                <AlertTriangle className="text-yellow-600 mr-2" size={20} />
                <h3 className="text-yellow-800 font-semibold">Targets Exceeded</h3>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {exceededNutrients.map(nutrient => (
                  <span
                    key={nutrient.name}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                  >
                    {nutrient.name}: {nutrient.percentage}%
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="text-blue-600" />
              Macro Nutrients Overview
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">All Nutrients Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={nutrientData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="consumed" fill="#3B82F6" name="Consumed" />
                <Bar dataKey="target" fill="#E5E7EB" name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Nutrient Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {nutrientData.map((nutrient, index) => (
            <div
              key={nutrient.name}
              className={`bg-white rounded-xl shadow-lg p-4 border-l-4 ${
                nutrient.exceeded 
                  ? 'border-red-500' 
                  : nutrient.percentage >= 80 
                    ? 'border-green-500' 
                    : 'border-blue-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-800">{nutrient.name}</h3>
                <span className={`text-sm font-bold ${
                  nutrient.exceeded 
                    ? 'text-red-600' 
                    : nutrient.percentage >= 80 
                      ? 'text-green-600' 
                      : 'text-blue-600'
                }`}>
                  {nutrient.percentage}%
                </span>
              </div>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Consumed: {nutrient.consumed} {nutrient.unit}</span>
                  <span>Target: {nutrient.target} {nutrient.unit}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      nutrient.exceeded 
                        ? 'bg-red-500' 
                        : nutrient.percentage >= 80 
                          ? 'bg-green-500' 
                          : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(nutrient.percentage, 100)}%` }}
                  />
                </div>
              </div>
              
              {!nutrient.exceeded && (
                <p className="text-xs text-gray-500">
                  Remaining: {nutrient.remaining} {nutrient.unit}
                </p>
              )}
              
              {nutrient.exceeded && (
                <p className="text-xs text-red-600 font-medium">
                  Exceeded by: {nutrient.consumed - nutrient.target} {nutrient.unit}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {nutrientData.filter(n => n.percentage >= 100).length}
              </p>
              <p className="text-sm text-gray-600">Targets Met</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">
                {exceededNutrients.length}
              </p>
              <p className="text-sm text-gray-600">Targets Exceeded</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {Math.round(nutrientData.reduce((acc, n) => acc + n.percentage, 0) / nutrientData.length)}%
              </p>
              <p className="text-sm text-gray-600">Average Progress</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {nutrientData.filter(n => n.percentage >= 80 && n.percentage < 100).length}
              </p>
              <p className="text-sm text-gray-600">Near Targets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutrientDashboard;