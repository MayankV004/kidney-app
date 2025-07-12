import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Clock,
  X,
  Zap,
  Scale,
  Target,
  ChevronRight,
  Sparkles,
  Plus,
  Save,
  AlertCircle,
  Filter,
  ChevronDown,
  RefreshCw,
  Heart,
} from "lucide-react";
import {
  Meal,
  CreateMealData,
  Nutrients,
  Food,
  CreateFoodData,
  SearchFilters,
} from "./food-types.ts";
import {
  searchFoods,
  createFood,
  getMeals,
  addFoodToMeal,
  getCategoryColor,
} from "../../utils/FoodSearchUtils.ts";
interface UserProfile {
  _id: string;
  name: string;
  email: string;
  age?: number;
  ckdStage?: 'STAGE_1' | 'STAGE_2' | 'STAGE_3' | 'STAGE_4' | 'STAGE_5';
  createdAt: string;
  updatedAt: string;
}
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from "react-hot-toast";
interface TableData {
  "#": number;
  "Meal Name": string;
  "Time": string;
  "Water (ml)": number;
  "Foods": string;
}
type ActiveView = "nutrients" | "serving" | "portions";
// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
const FoodSearchComponent: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [recentSearches, setRecentSearches] = useState<Food[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>("nutrients");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [createLoading, setCreateLoading] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [favoriteFoods, setFavoriteFoods] = useState<string[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showMealModal, setShowMealModal] = useState<boolean>(false);
  const [showCreateMealModal, setShowCreateMealModal] =
    useState<boolean>(false);
  const [selectedFoodForMeal, setSelectedFoodForMeal] = useState<Food | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [mealFormData, setMealFormData] = useState<CreateMealData>({
    name: "",
    timeOfDay: "breakfast",
    waterIntake: 0,
  });
  const [showMealsModal, setShowMealsModal] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalResults, setTotalResults] = useState<number>(0);

  // Search filters
  const [filters, setFilters] = useState<SearchFilters>({
    category: "",
    kidneyFriendly: null,
    sortBy: "name",
    sortOrder: "asc",
  });

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const fetchFavoriteFoods = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_ROUTE}/api/user/favorites`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch favorites");
      }

      const result = await response.json();
      console.log(result);
      const favoriteIds = result.map((fav: Food) => fav._id) || [];
      setFavoriteFoods(favoriteIds);
      console.log(favoriteIds);
      
      return favoriteIds;
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return [];
    }
  };

  const toggleFavoriteFood = async (foodId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${import.meta.env.VITE_API_ROUTE}/api/user/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foodId }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      const result = await response.json();
      console.log("FOOD", result);

      // Update local state immediately based on the action
      setFavoriteFoods((prev) => {
        const isCurrentlyFavorite = prev.includes(foodId);
        if (isCurrentlyFavorite) {
          return prev.filter((id) => id !== foodId);
        } else {
          return [...prev, foodId];
        }
      });

      return result;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return null;
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent, foodId: string) => {
    e.stopPropagation();
    e.preventDefault();

    const currentFoods = [...foods];
    await toggleFavoriteFood(foodId);

    if (foods.length === 0 && currentFoods.length > 0) {
      setFoods(currentFoods);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchFavoriteFoods();
    } else {
      setFavoriteFoods([]);
    }
  }, []);

  useEffect(() => {
    handleSearch(debouncedSearchTerm, 1);
  }, [
    debouncedSearchTerm,
    filters.category,
    filters.kidneyFriendly,
    filters.sortBy,
    filters.sortOrder,
  ]);

  const [formData, setFormData] = useState<CreateFoodData>({
    name: "",
    category: "OTHER",
    servingSize: 100,
    servingSizeUnit: "g",
    nutrients: {
      protein: 0,
      calories: 0,
      carbohydrates: 0,
      fats: 0,
      potassium: 0,
      phosphorus: 0,
      sodium: 0,
      calcium: 0,
      magnesium: 0,
      water: 0,
    },
    isKidneyFriendly: true,
  });

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("recentFoodSearches") || "[]"
    ) as Food[];
    setRecentSearches(saved);
  }, []);

  const handleSearch = useCallback(
    async (term: string, page: number = 1): Promise<void> => {
      if (!term.trim() && !filters.category) {
        setFoods([]);
        setTotalPages(0);
        setTotalResults(0);
        return;
      }

      setLoading(true);
      try {
        const result = await searchFoods(term, filters, page);
        setFoods(result.foods);
        setTotalPages(result.totalPages);
        setTotalResults(result.total);
        setCurrentPage(page);
      } catch (error) {
        console.error("Search error:", error);
        setFoods([]);
        setTotalPages(0);
        setTotalResults(0);
      }
      setLoading(false);
    },
    [filters]
  );
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const fetchedMeals = await getMeals();
        setMeals(fetchedMeals);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  const handleAddToMeal = (food: Food) => {
    setSelectedFoodForMeal(food);
    setQuantity(1);
    setShowMealModal(true);
  };

  const handleMealSubmit = async (mealId?: string) => {
    try {
      let mealData = undefined;
      if (!mealId) {
        mealData = mealFormData;
      }

      const result = await addFoodToMeal(
        selectedFoodForMeal!._id,
        quantity,
        mealId,
        mealData
      );

      // Refresh meals
      const updatedMeals = await getMeals();
      setMeals(updatedMeals);

      setShowMealModal(false);
      setShowCreateMealModal(false);
      setSelectedFoodForMeal(null);
      setMealFormData({
        name: "",
        timeOfDay: "breakfast",
        waterIntake: 0,
      });
    } catch (error) {
      console.error("Error adding food to meal:", error);
    }
  };
  const handlePageChange = (page: number): void => {
    if (page >= 1 && page <= totalPages) {
      handleSearch(debouncedSearchTerm, page);
    }
  };

  const addToRecentSearches = (food: Food): void => {
    const newRecent = [
      food,
      ...recentSearches.filter((f) => f._id !== food._id),
    ].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem("recentFoodSearches", JSON.stringify(newRecent));
  };

  const clearRecentSearches = (): void => {
    setRecentSearches([]);
    localStorage.setItem("recentFoodSearches", JSON.stringify([]));
  };

  const handleFoodClick = (food: Food): void => {
    setSelectedFood(food);
    addToRecentSearches(food);
    setActiveView("nutrients");
  };

  const clearFilters = (): void => {
    setFilters({
      category: "",
      kidneyFriendly: null,
      sortBy: "name",
      sortOrder: "asc",
    });
    setCurrentPage(1);
  };

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ): void => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleCreateFood = async (): Promise<void> => {
    setCreateError("");

    if (!formData.name.trim()) {
      setCreateError("Food name is required");
      return;
    }

    setCreateLoading(true);
    try {
      const newFood = await createFood(formData);
      setFoods((prevFoods) => [newFood, ...prevFoods]);
      setShowCreateModal(false);
      setFormData({
        name: "",
        category: "OTHER",
        servingSize: 100,
        servingSizeUnit: "g",
        nutrients: {
          protein: 0,
          calories: 0,
          carbohydrates: 0,
          fats: 0,
          potassium: 0,
          phosphorus: 0,
          sodium: 0,
          calcium: 0,
          magnesium: 0,
          water: 0,
        },
        isKidneyFriendly: true,
      });
    } catch (error) {
      setCreateError("Failed to create food. Please try again.");
    }
    setCreateLoading(false);
  };

  const updateFormData = (field: keyof CreateFoodData, value: any): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNutrient = (nutrient: keyof Nutrients, value: number): void => {
    setFormData((prev) => ({
      ...prev,
      nutrients: {
        ...prev.nutrients,
        [nutrient]: value,
      },
    }));
  };

    useEffect(() => { // fetching user profile to display details in meals PDF
      fetchUserProfile();
    }, []);

  const fetchUserProfile = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('You need to be logged in to view your profile');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_ROUTE}/api/user/profile`, {
         method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const userData: UserProfile = await response.json();
      setUserProfile(userData);
    
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast.error('Failed to fetch user profile. Please try again later.');
      
    }
  };
type RGBColor = [number, number, number];
const exportMealsAsPDF = async (
): Promise<void> => {
  try {
    const doc = new jsPDF();
    
    // Professional colors - minimal and clean
    const primaryColor: [number, number, number] = [52, 73, 94];    // Dark slate gray
    const lightGray: [number, number, number] = [245, 245, 245];    // Very light gray
    const textColor: [number, number, number] = [51, 51, 51];       // Dark gray
    
    // Minimal margins for professional look
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    let currentY = 20;
    
    // === HEADER SECTION ===
    // KidneyWise branding - top right
    doc.setTextColor(...primaryColor);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(76, 175, 80);
    doc.text("KidneyWise", pageWidth - margin - 25, currentY);
    
    // Report title - left aligned
    doc.setTextColor(...textColor);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Meals Report", margin, currentY);

   // === USER PROFILE SECTION ===
    currentY += 8;
    // User details
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    
    if (userProfile) {
      doc.text(`Name: ${userProfile.name}`, margin, currentY);
      currentY += 6;
      doc.text(`Age: ${userProfile.age} years`, margin, currentY);
      currentY += 6;
      doc.text(`CKD Stage: ${userProfile.ckdStage}`, margin, currentY);
      currentY += 15;
    } else {
      doc.text("User: Not logged in", margin, currentY);
      currentY += 15;
    }
    
    // === MEALS TABLE SECTION ===
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Meals Data", margin, currentY);
    
    currentY += 10;
    
    // Prepare table data
    const tableData = meals.map((meal: Meal, index: number) => [
      (index + 1).toString(),
      meal.name,
      meal.timeOfDay.charAt(0).toUpperCase() + meal.timeOfDay.slice(1),
      (meal.waterIntake || 0).toString(),
      meal.foods.map(f => f.food.name).join(", ")
    ]);
    
    const tableColumns = ["#", "Meal Name", "Time", "Water (ml)", "Foods"];
    
    // Create clean, professional table
    autoTable(doc, {
      head: [tableColumns],
      body: tableData,
      startY: currentY,
      styles: { 
        fontSize: 9,
        cellPadding: 4,
        lineColor: [220, 220, 220],
        lineWidth: 0.3,
        textColor: [...textColor]
      },
      headStyles: { 
        fillColor: [...lightGray],
        textColor: [...primaryColor],
        fontSize: 9,
        fontStyle: 'bold'
      },
      alternateRowStyles: { 
        fillColor: [250, 250, 250] 
      },
      columnStyles: {
        0: { cellWidth: 10, halign: 'center' },
        1: { cellWidth: 30, halign: 'center' },
        2: { cellWidth: 28, halign: 'center' },
        3: { cellWidth: 28, halign: 'center' },
        4: { cellWidth: 'auto' }
      },
      margin: { left: margin, right: margin },
      theme: 'grid',
      tableLineColor: [220, 220, 220],
      tableLineWidth: 0.3,
    });
    
    // === FOOTER ===
    const finalY = (doc as any).lastAutoTable.finalY + 20;
    
    // Report generation time
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    
    const generatedAt = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    doc.text(`Report generated on: ${generatedAt}`, margin, finalY);
    
    // Save the PDF
    const filename = `meals-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    toast.success("Meals report exported successfully!");
    
  } catch (error) {
    console.error("Error exporting meals as PDF:", error);
    toast.error("Failed to export meals. Please try again.");
  }
};

  const renderPagination = (): JSX.Element => {
    if (totalPages <= 1) return <></>;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisible = 5;

      if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        const start = Math.max(1, currentPage - 2);
        const end = Math.min(totalPages, start + maxVisible - 1);

        for (let i = start; i <= end; i++) {
          pages.push(i);
        }
      }

      return pages;
    };

    return (
      <>
     <div className="flex justify-center items-center space-x-1 sm:space-x-2 mt-6 px-2">
  <button
    onClick={() => handlePageChange(currentPage - 1)}
    disabled={currentPage === 1}
    className="px-2 sm:px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
  >
    <span className="hidden sm:inline">Previous</span>
    <span className="sm:hidden">Prev</span>
  </button>
  
  <div className="flex space-x-1 sm:space-x-2 overflow-x-auto max-w-xs sm:max-w-none">
    {getPageNumbers().map((page) => (
      <button
        key={page}
        onClick={() => handlePageChange(page)}
        className={`px-2 sm:px-3 py-2 rounded-lg border text-sm sm:text-base flex-shrink-0 ${
          currentPage === page
            ? "bg-blue-500 text-white border-blue-500"
            : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        {page}
      </button>
    ))}
  </div>
  
  <button
    onClick={() => handlePageChange(currentPage + 1)}
    disabled={currentPage === totalPages}
    className="px-2 sm:px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
  >
    <span className="hidden sm:inline">Next</span>
    <span className="sm:hidden">Next</span>
  </button>
</div>
      </>
    );
  };

  const renderFilters = (): JSX.Element => (
   <div 
  className={`bg-white/90 backdrop-blur-sm p-3 sm:p-4 lg:p-6 rounded-xl shadow-lg border border-gray-200 transition-all duration-300 ${
    showFilters ? "opacity-100" : "opacity-0 pointer-events-none"
  }`}
>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    {/* Category Filter */}
    <div className="col-span-1">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
        Category
      </label>
      <select
        value={filters.category}
        onChange={(e) => updateFilter("category", e.target.value)}
        className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">All Categories</option>
        <option value="VEGETABLES">Vegetables</option>
        <option value="FRUITS">Fruits</option>
        <option value="GRAINS">Grains</option>
        <option value="PROTEIN">Protein</option>
        <option value="DAIRY">Dairy</option>
        <option value="BEVERAGES">Beverages</option>
        <option value="SNACKS">Snacks</option>
        <option value="OTHER">Other</option>
      </select>
    </div>

    {/* Kidney Friendly Filter */}
    <div className="col-span-1">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
        Kidney Friendly
      </label>
      <select
        value={
          filters.kidneyFriendly === null
            ? ""
            : filters.kidneyFriendly.toString()
        }
        onChange={(e) =>
          updateFilter(
            "kidneyFriendly",
            e.target.value === "" ? null : e.target.value === "true"
          )
        }
        className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">All Foods</option>
        <option value="true">Kidney Friendly</option>
        <option value="false">Not Kidney Friendly</option>
      </select>
    </div>

    {/* Sort By */}
    <div className="col-span-1">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
        Sort By
      </label>
      <select
        value={filters.sortBy}
        onChange={(e) =>
          updateFilter("sortBy", e.target.value as SearchFilters["sortBy"])
        }
        className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="name">Name</option>
        <option value="calories">Calories</option>
        <option value="protein">Protein</option>
      </select>
    </div>

    {/* Sort Order */}
    <div className="col-span-1">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
        Order
      </label>
      <select
        value={filters.sortOrder}
        onChange={(e) =>
          updateFilter(
            "sortOrder",
            e.target.value as SearchFilters["sortOrder"]
          )
        }
        className="w-full px-2 sm:px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  </div>

  <div className="flex justify-center sm:justify-end mt-3 sm:mt-4">
    <button
      onClick={clearFilters}
      className="px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-600 hover:text-gray-800 transition-colors flex items-center bg-gray-50 hover:bg-gray-100 rounded-lg sm:bg-transparent sm:hover:bg-transparent"
    >
      <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
      Clear Filters
    </button>
  </div>
</div>
  );

  const renderNutrientBreakdown = (): JSX.Element => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Nutritional Breakdown
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(selectedFood!.nutrients).map(([key, value]) => (
          <div
            key={key}
            className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 rounded-lg"
          >
            <div className="text-sm text-gray-600 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </div>
            <div className="text-lg font-bold text-gray-800">
              {value}{" "}
              {key === "calories" ? "kcal" : key === "water" ? "%" : "mg"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderServingSize = (): JSX.Element => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Serving Information
      </h3>
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
        <div className="text-3xl font-bold text-indigo-600 mb-2">
          {selectedFood!.servingSize} {selectedFood!.servingSizeUnit}
        </div>
        <div className="text-gray-600">Standard serving size</div>
        <div className="mt-4 p-3 bg-white rounded-lg">
          <div className="text-sm text-gray-500">Kidney Friendly</div>
          <div
            className={`text-lg font-semibold ${
              selectedFood!.isKidneyFriendly ? "text-green-600" : "text-red-600"
            }`}
          >
            {selectedFood!.isKidneyFriendly ? "✓ Yes" : "✗ No"}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPortionSuggestion = (): JSX.Element => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Portion Suggestions
      </h3>
      <div className="space-y-3">
        {[0.5, 1, 1.5, 2].map((multiplier) => (
          <div
            key={multiplier}
            className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold text-gray-800">
                  {multiplier}x portion (
                  {selectedFood!.servingSize * multiplier}{" "}
                  {selectedFood!.servingSizeUnit})
                </div>
                <div className="text-sm text-gray-600">
                  {Math.round(selectedFood!.nutrients.calories * multiplier)}{" "}
                  calories
                </div>
              </div>
              <div className="text-emerald-600 font-bold">
                {multiplier === 1
                  ? "Recommended"
                  : multiplier < 1
                  ? "Light"
                  : "Heavy"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCreateModal = (): JSX.Element => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Create New Food
            </h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {createError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {createError}
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Food Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Enter food name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    updateFormData(
                      "category",
                      e.target.value as Food["category"]
                    )
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="VEGETABLES">Vegetables</option>
                  <option value="FRUITS">Fruits</option>
                  <option value="GRAINS">Grains</option>
                  <option value="PROTEIN">Protein</option>
                  <option value="DAIRY">Dairy</option>
                  <option value="BEVERAGES">Beverages</option>
                  <option value="SNACKS">Snacks</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="kidneyFriendly"
                  checked={formData.isKidneyFriendly}
                  onChange={(e) =>
                    updateFormData("isKidneyFriendly", e.target.checked)
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="kidneyFriendly"
                  className="text-sm font-medium text-gray-700"
                >
                  Kidney Friendly
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Serving Size
                </label>
                <input
                  type="number"
                  value={formData.servingSize}
                  onChange={(e) =>
                    updateFormData("servingSize", Number(e.target.value))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  min="0"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.servingSizeUnit}
                  onChange={(e) =>
                    updateFormData("servingSizeUnit", e.target.value)
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder="g, ml, cup, etc."
                />
              </div>
            </div>
          </div>

          {/* Nutrients */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Nutritional Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(formData.nutrients).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, " $1")}{" "}
                    {key === "calories"
                      ? "(kcal)"
                      : key === "water"
                      ? "(%)"
                      : "(mg)"}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) =>
                      updateNutrient(
                        key as keyof Nutrients,
                        Number(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                    min="0"
                    step="0.1"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={() => setShowCreateModal(false)}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateFood}
            disabled={createLoading}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center disabled:opacity-50"
          >
            {createLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {createLoading ? "Creating..." : "Create Food"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderMealSelectionModal = (): JSX.Element => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Add {selectedFoodForMeal?.name} to Meal
            </h2>
            <button
              onClick={() => setShowMealModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              min="0.1"
              step="0.1"
            />
          </div>

          {meals.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Add to Existing Meal
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {meals.map((meal) => (
                  <button
                    key={meal._id}
                    onClick={() => handleMealSubmit(meal._id)}
                    className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <div className="font-medium text-gray-800">{meal.name}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {meal.timeOfDay}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setShowMealModal(false);
                setShowCreateMealModal(true);
              }}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center font-medium"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Meal
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreateMealModal = (): JSX.Element => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Create New Meal
            </h2>
            <button
              onClick={() => setShowCreateMealModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Name
            </label>
            <input
              type="text"
              value={mealFormData.name}
              onChange={(e) =>
                setMealFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Enter meal name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time of Day
            </label>
            <select
              value={mealFormData.timeOfDay}
              onChange={(e) =>
                setMealFormData((prev) => ({
                  ...prev,
                  timeOfDay: e.target.value,
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Water Intake (ml)
            </label>
            <input
              type="number"
              value={mealFormData.waterIntake}
              onChange={(e) =>
                setMealFormData((prev) => ({
                  ...prev,
                  waterIntake: Number(e.target.value),
                }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              min="0"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            onClick={() => setShowCreateMealModal(false)}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleMealSubmit()}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Create & Add Food
          </button>
        </div>
      </div>
    </div>
  );

  const renderMealsModal = (): JSX.Element => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Your Meals</h2>
            <div className="flex items-center space-x-4">
              <button
                  onClick={exportMealsAsPDF}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:scale-105 transition-all duration-200 flex items-center"
                >
                  Export Meals as PDF
                </button>
              <button
              onClick={() => setShowMealsModal(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            </div>
            
          </div>
        </div>

        <div className="p-6">
          {meals.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No meals yet
              </h3>
              <p className="text-gray-600">
                Start by adding foods to create your first meal
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {meals.map((meal) => (
                <div key={meal._id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {meal.name}
                      </h3>
                      <p className="text-gray-600 capitalize">
                        {meal.timeOfDay}
                      </p>
                      {meal.waterIntake > 0 && (
                        <p className="text-sm text-blue-600">
                          Water: {meal.waterIntake}ml
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(meal.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {meal.foods.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-700">Foods:</h4>
                      {meal.foods.map((foodItem, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-white p-2 rounded"
                        >
                          <span className="text-gray-800">
                            {foodItem.food.name}
                          </span>
                          <span className="text-gray-600 text-sm">
                            Qty: {foodItem.quantity} •{" "}
                            {Math.round(
                              foodItem.food.nutrients.calories *
                                foodItem.quantity
                            )}{" "}
                            cal
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
     <div className="max-w-6xl mx-auto p-4 sm:p-6  min-h-screen">
  {/* Header */}
  <div className="text-center mb-6 sm:mb-8">
    <div className="flex items-center justify-center mb-4">
      <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mr-2" />
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Food Explorer
      </h1>
    </div>
    <p className="text-gray-600 text-base sm:text-lg mb-4 px-4">
      Discover nutritional insights for healthy living
    </p>
    <div className="flex justify-center">
      <button
        onClick={() => setShowMealsModal(true)}
        className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center font-medium text-sm sm:text-base"
      >
        <Target className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        View Meals
      </button>
    </div>
  </div>
  
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
    {/* Search Section */}
    <div
      className={`space-y-4 sm:space-y-6 ${
        !recentSearches.length && !selectedFood
          ? "xl:col-span-3"
          : "xl:col-span-2"
      }`}
    >
      {/* Search Bar & Buttons */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1 order-1 sm:order-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for foods..."
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-lg hover:shadow-xl"
            />
          </div>
          
          <div className="flex gap-2 sm:gap-3 order-2 sm:order-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center font-medium text-sm sm:text-base ${
                showFilters
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                  : "bg-white/80 text-gray-700 hover:bg-white"
              }`}
            >
              <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Filters</span>
              <ChevronDown
                className={`w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2 transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center font-medium text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Create Food</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        {renderFilters()}
      </div>

      {/* Search Results Info */}
      {(searchTerm || filters.category) && (
        <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div className="text-gray-600 text-sm sm:text-base">
              {loading ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  Searching...
                </span>
              ) : (
                <span>
                  Found <strong>{totalResults}</strong> results
                  {searchTerm && (
                    <span>
                      {" "}
                      for "<strong className="break-words">{searchTerm}</strong>"
                    </span>
                  )}
                  {filters.category && (
                    <span>
                      {" "}
                      in <strong>{filters.category}</strong>
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8 sm:py-12">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Search Results */}
      {!loading && foods.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => handleFoodClick(food)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex-1 pr-2">
                      {food.name}
                    </h3>
                    <button
                      onClick={(e) => handleFavoriteToggle(e, food._id)}
                      className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
                        favoriteFoods.includes(food._id)
                          ? "text-red-500 hover:text-red-600"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          favoriteFoods.includes(food._id)
                            ? "fill-current"
                            : ""
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-white text-xs sm:text-sm font-medium bg-gradient-to-r ${getCategoryColor(
                      food.category
                    )}`}
                  >
                    {food.category}
                  </div>
                  
                  <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <span className="flex items-center">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {food.nutrients.calories} cal
                    </span>
                    <span className="flex items-center">
                      <Scale className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {food.servingSize}
                      {food.servingSizeUnit}
                    </span>
                    {food.isKidneyFriendly && (
                      <span className="text-green-600 font-medium flex items-center">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Kidney Friendly
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 break-words">
                    Protein: {food.nutrients.protein}mg • Sodium:{" "}
                    {food.nutrients.sodium}mg • Potassium:{" "}
                    {food.nutrients.potassium}mg
                  </div>
                </div>
                
                <div className="flex flex-row sm:flex-col gap-2 sm:gap-2 items-center sm:items-end">
                  <button
                    onClick={() => handleAddToMeal(food)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center text-xs sm:text-sm font-medium"
                  >
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span className="hidden sm:inline">Add to Meal</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                  <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {renderPagination()}
        </div>
      )}

      {/* No Results */}
      {!loading &&
        (searchTerm || filters.category) &&
        foods.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                No foods found
              </h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Try adjusting your search terms or filters
              </p>
              <button
                onClick={clearFilters}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm sm:text-base"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
    </div>

    {/* Sidebar */}
    <div className="space-y-4 sm:space-y-6">
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Recent Searches
            </h3>
            <button
              onClick={clearRecentSearches}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {recentSearches.map((food) => (
              <div
                key={food._id}
                className="p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-transparent hover:border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex-1 pr-2"
                    onClick={() => handleFoodClick(food)}
                  >
                    <div className="font-medium text-gray-800 text-sm sm:text-base break-words">
                      {food.name}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 flex items-center mt-1">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 bg-gradient-to-r ${getCategoryColor(
                          food.category
                        )}`}
                      ></span>
                      {food.category} • {food.nutrients.calories} cal
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleFavoriteToggle(e, food._id)}
                    className={`p-1 rounded-full transition-all duration-200 hover:scale-110 ${
                      favoriteFoods.includes(food._id)
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        favoriteFoods.includes(food._id)
                          ? "fill-current"
                          : ""
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected Food Details */}
      {selectedFood && (
        <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 break-words">
              {selectedFood.name}
            </h2>
            <div
              className={`inline-block px-3 py-1 rounded-full text-white text-xs sm:text-sm font-medium bg-gradient-to-r ${getCategoryColor(
                selectedFood.category
              )}`}
            >
              {selectedFood.category}
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex mb-4 sm:mb-6 bg-gray-100 p-1 rounded-xl">
            {[
              {
                key: "nutrients",
                icon: Zap,
                label: "Nutrients",
              },
              {
                key: "serving",
                icon: Scale,
                label: "Serving",
              },
              {
                key: "portions",
                icon: Target,
                label: "Portions",
              },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveView(key as ActiveView)}
                className={`flex-1 flex items-center justify-center py-2 px-2 sm:px-3 rounded-lg transition-all duration-200 ${
                  activeView === key
                    ? "bg-white shadow-md text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                <span className="text-xs sm:text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="transition-all duration-300">
            {activeView === "nutrients" && renderNutrientBreakdown()}
            {activeView === "serving" && renderServingSize()}
            {activeView === "portions" && renderPortionSuggestion()}
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Create Modal */}
  {showCreateModal && renderCreateModal()}
  {showMealModal && renderMealSelectionModal()}
  {showCreateMealModal && renderCreateMealModal()}
  {showMealsModal && renderMealsModal()}
</div>
    </>
  );
};

export default FoodSearchComponent;
