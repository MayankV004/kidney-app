import Food from "../models/food-model.js";
export const getAllFood = async (req, res) => {
  try {
    const { search, category, page = 1, limit = 50 } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const foods = await Food.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ name: 1 });

    const total = await Food.countDocuments(query);

    res.json({
      foods,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get foods error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createFood = async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.status(201).json(food);
  } catch (error) {
    console.error("Create food error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
