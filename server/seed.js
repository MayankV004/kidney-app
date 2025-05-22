import Food from './models/food-model.js'

export const seedFoods = async () => {
  try {
    const count = await Food.countDocuments();
    if (count === 0) {
      const sampleFoods = [
        {
          name: "Grilled Chicken Breast",
          category: "PROTEIN",
          servingSize: 100,
          servingSizeUnit: "g",
          nutrients: {
            protein: 31,
            calories: 165,
            carbohydrates: 0,
            fats: 3.6,
            potassium: 256,
            phosphorus: 228,
            sodium: 74,
            calcium: 15,
            magnesium: 29,
            water: 0
          },
          isKidneyFriendly: true
        },
        {
          name: "Brown Rice",
          category: "GRAINS",
          servingSize: 100,
          servingSizeUnit: "g",
          nutrients: {
            protein: 2.3,
            calories: 111,
            carbohydrates: 22,
            fats: 0.9,
            potassium: 43,
            phosphorus: 83,
            sodium: 5,
            calcium: 23,
            magnesium: 44,
            water: 0
          },
          isKidneyFriendly: true
        },
        {
          name: "Broccoli",
          category: "VEGETABLES",
          servingSize: 100,
          servingSizeUnit: "g",
          nutrients: {
            protein: 2.8,
            calories: 34,
            carbohydrates: 7,
            fats: 0.4,
            potassium: 316,
            phosphorus: 66,
            sodium: 33,
            calcium: 47,
            magnesium: 21,
            water: 0
          },
          isKidneyFriendly: true
        }
      ];

      await Food.insertMany(sampleFoods);
      console.log('Sample foods seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding foods:', error);
  }
};

