export type User = {
  id: string;
  email: string;
  name: string;
  ckdStage?: CKDStage;
  onDialysis?: boolean;
  hasDiabetes?: boolean;
  hasHighBloodPressure?: boolean;
  referralSource?: ReferralSource;
};

export type NutrientTarget = {
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
};

export type Food = {
  id: string;
  name: string;
  servingSize: string;
  servingSizeUnit: string;
  nutrients: {
    protein: number;
    calories: number;
    carbohydrates: number;
    fats: number;
    potassium: number;
    phosphorus: number;
    sodium: number;
    calcium: number;
    magnesium: number;
  };
  category: FoodCategory;
};

export type Meal = {
  id: string;
  name: string;
  foods: {
    food: Food;
    quantity: number;
  }[];
  waterIntake?: number;
  timeOfDay?: string;
};

export type DailyIntake = {
  date: string;
  meals: Meal[];
  totalNutrients: NutrientTarget;
};

export enum CKDStage {
  STAGE_1 = "CKD Stage 1",
  STAGE_2 = "CKD Stage 2",
  STAGE_3 = "CKD Stage 3",
  STAGE_4 = "CKD Stage 4",
  STAGE_5 = "CKD Stage 5",
  NOT_DIAGNOSED = "Not Diagnosed Yet"
}

export enum FoodCategory {
  VEGETABLES = "Vegetables",
  FRUITS = "Fruits",
  GRAINS = "Grains",
  PROTEIN = "Protein",
  DAIRY = "Dairy",
  BEVERAGES = "Beverages",
  SNACKS = "Snacks",
  OTHER = "Other"
}

export enum ReferralSource {
  SOCIAL_MEDIA = "Social Media",
  DOCTOR = "Doctor",
  FRIEND = "Friend",
  ADVERTISEMENT = "Advertisement",
  OTHER = "Other"
}

export enum DietChartMethod {
  CUSTOM = "Add My Own Specific Values",
  AGE_BASED = "Use Values Based on My Age",
  CKD_STAGE = "Use General Values Based on Kidney Disease Stage"
}

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};