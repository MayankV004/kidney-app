export interface Meal {
  _id: string;
  name: string;
  timeOfDay: string;
  waterIntake: number;
  foods: Array<{
    food: Food;
    quantity: number;
  }>;
  createdAt: Date;
}

export interface CreateMealData {
  name: string;
  timeOfDay: string;
  waterIntake: number;
}
export interface Nutrients {
  protein: number;
  calories: number;
  carbohydrates: number;
  fats: number;
  potassium: number;
  phosphorus: number;
  sodium: number;
  calcium: number;
  magnesium: number;
  water: number;
}

export interface Food {
  _id: string;
  name: string;
  category:
    | "VEGETABLES"
    | "FRUITS"
    | "GRAINS"
    | "PROTEIN"
    | "DAIRY"
    | "BEVERAGES"
    | "SNACKS"
    | "OTHER";
  servingSize: number;
  servingSizeUnit: string;
  nutrients: Nutrients;
  isKidneyFriendly: boolean;
  createdAt: Date;
}

export interface SearchResponse {
  foods: Food[];
  totalPages: number;
  currentPage: number;
  total: number;
}

export interface CreateFoodData {
  name: string;
  category: Food["category"];
  servingSize: number;
  servingSizeUnit: string;
  nutrients: Nutrients;
  isKidneyFriendly: boolean;
}

export interface SearchFilters {
  category: string;
  kidneyFriendly: boolean | null;
  sortBy: "name" | "calories" | "protein";
  sortOrder: "asc" | "desc";
}