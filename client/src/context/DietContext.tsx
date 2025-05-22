import React, { createContext, useContext, useState, useEffect } from 'react';
import { NutrientTarget, CKDStage, DietChartMethod } from '../types';
import { useAuth } from './AuthContext';

interface DietContextType {
  nutrientTargets: NutrientTarget;
  generateDietChart: (method: DietChartMethod, age?: number) => void;
  updateNutrientTargets: (targets: Partial<NutrientTarget>) => void;
}

// Default nutrient targets
const defaultNutrientTargets: NutrientTarget = {
  protein: 60,
  calories: 2000,
  carbohydrates: 300,
  fats: 65,
  potassium: 2000,
  phosphorus: 800,
  sodium: 2000,
  calcium: 1000,
  magnesium: 300,
  water: 2000,
};

const DietContext = createContext<DietContextType | undefined>(undefined);

export const DietProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [nutrientTargets, setNutrientTargets] = useState<NutrientTarget>(defaultNutrientTargets);

  useEffect(() => {
    const storedTargets = localStorage.getItem('nutrientTargets');
    if (storedTargets) {
      setNutrientTargets(JSON.parse(storedTargets));
    }
  }, []);

  const updateNutrientTargets = (targets: Partial<NutrientTarget>) => {
    const updatedTargets = { ...nutrientTargets, ...targets };
    setNutrientTargets(updatedTargets);
    localStorage.setItem('nutrientTargets', JSON.stringify(updatedTargets));
  };

  const generateDietChart = (method: DietChartMethod, age?: number) => {
    let newTargets: NutrientTarget = { ...nutrientTargets };

    switch (method) {
      case DietChartMethod.CUSTOM:
        // Custom values are set directly through updateNutrientTargets
        break;
      case DietChartMethod.AGE_BASED:
        if (age) {
          // Adjust based on age
          if (age < 30) {
            newTargets = {
              ...nutrientTargets,
              protein: 70,
              calories: 2200,
              water: 2500,
            };
          } else if (age < 50) {
            newTargets = {
              ...nutrientTargets,
              protein: 65,
              calories: 2000,
              water: 2300,
            };
          } else {
            newTargets = {
              ...nutrientTargets,
              protein: 60,
              calories: 1800,
              water: 2000,
            };
          }
        }
        break;
      case DietChartMethod.CKD_STAGE:
        if (user?.ckdStage) {
          // Adjust based on CKD stage
          switch (user.ckdStage) {
            case CKDStage.STAGE_1:
              newTargets = {
                ...nutrientTargets,
                protein: 80,
                potassium: 3000,
                phosphorus: 1000,
                sodium: 2300,
              };
              break;
            case CKDStage.STAGE_2:
              newTargets = {
                ...nutrientTargets,
                protein: 70,
                potassium: 2500,
                phosphorus: 900,
                sodium: 2000,
              };
              break;
            case CKDStage.STAGE_3:
              newTargets = {
                ...nutrientTargets,
                protein: 60,
                potassium: 2000,
                phosphorus: 800,
                sodium: 1500,
              };
              break;
            case CKDStage.STAGE_4:
              newTargets = {
                ...nutrientTargets,
                protein: 50,
                potassium: 1500,
                phosphorus: 700,
                sodium: 1300,
              };
              break;
            case CKDStage.STAGE_5:
              newTargets = {
                ...nutrientTargets,
                protein: 40,
                potassium: 1000,
                phosphorus: 600,
                sodium: 1000,
              };
              break;
            default:
              break;
          }
        }
        break;
      default:
        break;
    }

    setNutrientTargets(newTargets);
    localStorage.setItem('nutrientTargets', JSON.stringify(newTargets));
  };

  return (
    <DietContext.Provider
      value={{
        nutrientTargets,
        generateDietChart,
        updateNutrientTargets,
      }}
    >
      {children}
    </DietContext.Provider>
  );
};

export const useDiet = () => {
  const context = useContext(DietContext);
  if (context === undefined) {
    throw new Error('useDiet must be used within a DietProvider');
  }
  return context;
};