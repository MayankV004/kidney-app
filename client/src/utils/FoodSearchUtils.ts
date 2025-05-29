import { Meal ,CreateMealData,Nutrients,Food,SearchResponse,CreateFoodData,SearchFilters} from "../components/food/food-types"
export const addMealToDailyIntake = async (mealId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_API_ROUTE}/api/daily-intake`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        mealId,
        date: new Date().toISOString().split("T")[0], // Today's date
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add meal to daily intake");
    }

    return response.json();
  } catch (error) {
    console.error("Error adding meal to daily intake:", error);
    // Don't throw error to prevent breaking the meal creation flow
  }
};


export const searchFoods = async (
  query: string,
  filters: SearchFilters,
  page: number = 1
): Promise<SearchResponse> => {
  try {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.append("search", query.trim());
    }

    if (filters.category) {
      params.append("category", filters.category);
    }

    params.append("page", page.toString());
    params.append("limit", "10");

    const token = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_API_ROUTE}/api/foods?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Client-side filtering for kidney friendly (if your backend doesn't support it)
    let filteredFoods = data.foods;
    if (filters.kidneyFriendly !== null) {
      filteredFoods = filteredFoods.filter(
        (food: Food) => food.isKidneyFriendly === filters.kidneyFriendly
      );
    }

    // Client-side sorting
    filteredFoods.sort((a: Food, b: Food) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (filters.sortBy) {
        case "calories":
          aValue = a.nutrients.calories;
          bValue = b.nutrients.calories;
          break;
        case "protein":
          aValue = a.nutrients.protein;
          bValue = b.nutrients.protein;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (filters.sortOrder === "desc") {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    return {
      ...data,
      foods: filteredFoods,
    };
  } catch (error) {
    console.error("Search error:", error);
    return {
      foods: [],
      totalPages: 0,
      currentPage: 1,
      total: 0,
    };
  }
};


 export const createFood = async (foodData: CreateFoodData): Promise<Food> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${import.meta.env.VITE_API_ROUTE}/api/foods`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(foodData),
  });

  if (!response.ok) {
    throw new Error("Failed to create food");
  }

  return response.json();
};

  export const getMeals = async (): Promise<Meal[]> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_API_ROUTE}/api/meals`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch meals");
    }

    return response.json();
  };
export   const addFoodToMeal = async (
    foodId: string,
    quantity: number,
    mealId?: string,
    mealData?: CreateMealData
  ) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${import.meta.env.VITE_API_ROUTE}/api/meals/add-food`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        foodId,
        quantity,
        mealId,
        mealData,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add food to meal");
    }

    const result=await response.json()
    await addMealToDailyIntake(result.meal._id);
    return result;
  };


    export const getCategoryColor = (category: Food["category"]): string => {
    const colors: Record<Food["category"], string> = {
      VEGETABLES: "from-green-400 to-emerald-500",
      FRUITS: "from-orange-400 to-red-500",
      GRAINS: "from-yellow-400 to-orange-500",
      PROTEIN: "from-purple-400 to-pink-500",
      DAIRY: "from-blue-400 to-cyan-500",
      BEVERAGES: "from-cyan-400 to-blue-500",
      SNACKS: "from-pink-400 to-rose-500",
      OTHER: "from-gray-400 to-slate-500",
    };
    return colors[category];
  };