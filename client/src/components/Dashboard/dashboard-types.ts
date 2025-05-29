export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  activityLevel?: string;
  dietaryPreferences?: string[];
  healthGoals?: string[];
  // CKD-specific fields
  ckdStage?: string;
  onDialysis?: boolean;
  hasDiabetes?: boolean;
  hasHypertension?: boolean;
  howDidYouHear?: string;
  medicalConditions?: string[];
  profileCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}


export interface EditFormData {
  name: string;
  email: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  dietaryPreferences: string[];
  healthGoals: string[];
}

export interface CKDFormData {
  howDidYouHear: string;
  ckdStage: string;
  onDialysis: boolean;
  hasDiabetes: boolean;
  hasHypertension: boolean;
}


