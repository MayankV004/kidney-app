import FavoriteFood from "../models/favouriteFood-model.js";
import User from "../models/user-model.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password").populate('dietChart');
    if (!user) {
      return res.status(404).json({ error: "User not found" });`1`
    }
    console.log("data sent")
    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password; // Don't allow password updates through this endpoint

    updates.updatedAt = new Date();

    const user = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      select: "-password",
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFavoriteFoods = async (req, res) => {
  try {
    const favorites = await FavoriteFood.find({ userId: req.user.userId })
      .populate("foodId")
      .sort({ createdAt: -1 });

    const favoriteFoods = favorites.map((fav) => fav.foodId);
    res.json(favoriteFoods);
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addFavoriteFood = async (req, res) => {
  try {
    const { foodId } = req.body;

    const existingFavorite = await FavoriteFood.findOne({
      userId: req.user.userId,
      foodId,
    });

    if (existingFavorite) {
      await FavoriteFood.deleteOne({ _id: existingFavorite._id });
      res.json({ message: "Food removed from favorites" });
    } else {
      const favorite = new FavoriteFood({
        userId: req.user.userId,
        foodId,
      });
      await favorite.save();
      res.json({ message: "Food added to favorites" });
    }
  } catch (error) {
    console.error("Toggle favorite error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
