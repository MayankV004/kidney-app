import React, { useState } from 'react';
import { Search, Star, Plus, StarOff, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { useFood } from '../../context/FoodContext';
import { Food } from '../../types';

interface FoodSearchProps {
  onSelectFood: (food: Food) => void;
}

export const FoodSearch: React.FC<FoodSearchProps> = ({ onSelectFood }) => {
  const { foods, searchFoods, favoriteFoods, toggleFavoriteFood, recentSearches } = useFood();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [activeTab, setActiveTab] = useState<'search' | 'favorites' | 'recent'>('search');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const results = searchFoods(query);
      setSearchResults(results);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length >= 2) {
      const results = searchFoods(value);
      setSearchResults(results);
    } else if (value.length === 0) {
      setSearchResults([]);
    }
  };

  const displayFoods = () => {
    switch (activeTab) {
      case 'favorites':
        return favoriteFoods;
      case 'recent':
        return recentSearches;
      case 'search':
      default:
        return searchResults;
    }
  };

  const isFavorite = (food: Food) => {
    return favoriteFoods.some(f => f.id === food.id);
  };

  return (
    <div className="w-full">
      <div className="flex items-center space-x-4 mb-4">
        <Button
          variant={activeTab === 'search' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('search')}
          icon={<Search className="h-4 w-4" />}
        >
          Search
        </Button>
        <Button
          variant={activeTab === 'favorites' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('favorites')}
          icon={<Star className="h-4 w-4" />}
        >
          Favorites
        </Button>
        <Button
          variant={activeTab === 'recent' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('recent')}
          icon={<Clock className="h-4 w-4" />}
        >
          Recent
        </Button>
      </div>

      {activeTab === 'search' && (
        <form onSubmit={handleSearch} className="mb-4">
          <Input
            placeholder="Search for foods..."
            value={query}
            onChange={handleInputChange}
            icon={<Search className="h-5 w-5 text-neutral-400" />}
          />
        </form>
      )}

      <AnimatePresence>
        <div className="space-y-2">
          {displayFoods().length > 0 ? (
            displayFoods().map((food) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="hover:shadow-elevation-3 transition-shadow">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-neutral-900">{food.name}</h3>
                        <p className="text-sm text-neutral-500">
                          {food.servingSize} {food.servingSizeUnit}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavoriteFood(food)}
                          icon={
                            isFavorite(food) ? (
                              <Star className="h-4 w-4 text-warning-500 fill-warning-500" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )
                          }
                          aria-label={isFavorite(food) ? "Remove from favorites" : "Add to favorites"}
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => onSelectFood(food)}
                          icon={<Plus className="h-4 w-4" />}
                          aria-label="Add food"
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="font-medium">Calories:</span>{' '}
                        {food.nutrients.calories}
                      </div>
                      <div>
                        <span className="font-medium">Protein:</span>{' '}
                        {food.nutrients.protein}g
                      </div>
                      <div>
                        <span className="font-medium">Carbs:</span>{' '}
                        {food.nutrients.carbohydrates}g
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-neutral-500">
              {activeTab === 'search' && query.length > 0
                ? 'No foods found. Try a different search term.'
                : activeTab === 'favorites'
                ? 'No favorite foods yet. Mark foods as favorites to see them here.'
                : activeTab === 'recent'
                ? 'No recent searches. Search for foods to see them here.'
                : 'Search for foods to add to your meals.'}
            </div>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
};