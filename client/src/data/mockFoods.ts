import { Food, FoodCategory } from '../types';

export const mockFoods: Food[] = [
  {
    id: '1',
    name: 'Chicken Breast',
    servingSize: '100',
    servingSizeUnit: 'g',
    nutrients: {
      protein: 31,
      calories: 165,
      carbohydrates: 0,
      fats: 3.6,
      potassium: 256,
      phosphorus: 210,
      sodium: 74,
      calcium: 15,
      magnesium: 29
    },
    category: FoodCategory.PROTEIN
  },
  {
    id: '2',
    name: 'Brown Rice',
    servingSize: '100',
    servingSizeUnit: 'g',
    nutrients: {
      protein: 2.6,
      calories: 112,
      carbohydrates: 23.5,
      fats: 0.9,
      potassium: 79,
      phosphorus: 83,
      sodium: 5,
      calcium: 10,
      magnesium: 44
    },
    category: FoodCategory.GRAINS
  },
  {
    id: '3',
    name: 'Spinach',
    servingSize: '100',
    servingSizeUnit: 'g',
    nutrients: {
      protein: 2.9,
      calories: 23,
      carbohydrates: 3.6,
      fats: 0.4,
      potassium: 558,
      phosphorus: 49,
      sodium: 79,
      calcium: 99,
      magnesium: 79
    },
    category: FoodCategory.VEGETABLES
  },
  {
    id: '4',
    name: 'Apple',
    servingSize: '1',
    servingSizeUnit: 'medium',
    nutrients: {
      protein: 0.3,
      calories: 95,
      carbohydrates: 25,
      fats: 0.2,
      potassium: 195,
      phosphorus: 20,
      sodium: 2,
      calcium: 11,
      magnesium: 9
    },
    category: FoodCategory.FRUITS
  },
  {
    id: '5',
    name: 'Low-fat Milk',
    servingSize: '240',
    servingSizeUnit: 'ml',
    nutrients: {
      protein: 8.2,
      calories: 102,
      carbohydrates: 12.2,
      fats: 2.4,
      potassium: 366,
      phosphorus: 232,
      sodium: 107,
      calcium: 293,
      magnesium: 27
    },
    category: FoodCategory.DAIRY
  },
  {
    id: '6',
    name: 'Salmon',
    servingSize: '100',
    servingSizeUnit: 'g',
    nutrients: {
      protein: 20,
      calories: 206,
      carbohydrates: 0,
      fats: 13,
      potassium: 363,
      phosphorus: 252,
      sodium: 59,
      calcium: 12,
      magnesium: 29
    },
    category: FoodCategory.PROTEIN
  },
  {
    id: '7',
    name: 'Sweet Potato',
    servingSize: '100',
    servingSizeUnit: 'g',
    nutrients: {
      protein: 1.6,
      calories: 86,
      carbohydrates: 20.1,
      fats: 0.1,
      potassium: 337,
      phosphorus: 47,
      sodium: 55,
      calcium: 30,
      magnesium: 25
    },
    category: FoodCategory.VEGETABLES
  },
  {
    id: '8',
    name: 'Oatmeal',
    servingSize: '100',
    servingSizeUnit: 'g',
    nutrients: {
      protein: 13.2,
      calories: 389,
      carbohydrates: 66.3,
      fats: 6.9,
      potassium: 429,
      phosphorus: 523,
      sodium: 2,
      calcium: 54,
      magnesium: 177
    },
    category: FoodCategory.GRAINS
  },
  {
    id: '9',
    name: 'Banana',
    servingSize: '1',
    servingSizeUnit: 'medium',
    nutrients: {
      protein: 1.1,
      calories: 105,
      carbohydrates: 27,
      fats: 0.4,
      potassium: 422,
      phosphorus: 26,
      sodium: 1,
      calcium: 5,
      magnesium: 32
    },
    category: FoodCategory.FRUITS
  },
  {
    id: '10',
    name: 'Egg',
    servingSize: '1',
    servingSizeUnit: 'large',
    nutrients: {
      protein: 6.3,
      calories: 72,
      carbohydrates: 0.4,
      fats: 4.8,
      potassium: 69,
      phosphorus: 99,
      sodium: 71,
      calcium: 28,
      magnesium: 6
    },
    category: FoodCategory.PROTEIN
  },
  {
    id: '11',
    name: 'Broccoli',
    servingSize: '100',
    servingSizeUnit: 'g',
    nutrients: {
      protein: 2.8,
      calories: 34,
      carbohydrates: 6.6,
      fats: 0.4,
      potassium: 316,
      phosphorus: 66,
      sodium: 33,
      calcium: 47,
      magnesium: 21
    },
    category: FoodCategory.VEGETABLES
  },
  {
    id: '12',
    name: 'Greek Yogurt (Plain)',
    servingSize: '200',
    servingSizeUnit: 'g',
    nutrients: {
      protein: 20,
      calories: 130,
      carbohydrates: 9,
      fats: 0.7,
      potassium: 240,
      phosphorus: 218,
      sodium: 82,
      calcium: 200,
      magnesium: 19
    },
    category: FoodCategory.DAIRY
  }
];