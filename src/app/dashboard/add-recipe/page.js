"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { axiosSecure } from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiUploadCloud } from "react-icons/fi";
import axios from "axios";

export default function AddRecipePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    recipeName: "",
    category: "",
    cuisineType: "",
    difficultyLevel: "",
    preparationTime: "",
    ingredients: "",
    instructions: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Please select a recipe image");

    setLoading(true);

    try {
      const imageFormData = new FormData();
      imageFormData.append("image", imageFile);
      const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
      
      const imgbbResponse = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        imageFormData
      );
      const imageUrl = imgbbResponse.data.data.display_url;

      const recipeData = {
        ...formData,
        recipeImage: imageUrl,
        authorName: user?.name || "Unknown",
        authorEmail: user?.email,
        authorId: user?.userId || user?._id, 
        likesCount: 0,
        isFeatured: false,
        status: "active"
      };

      const backendResponse = await axiosSecure.post("/recipes", recipeData);

      if (backendResponse.status === 201 || backendResponse.status === 200) {
        toast.success("Recipe added successfully!");
        router.push("/dashboard/my-recipes");
      }
    } catch (error) {
      console.error("Add Recipe Error:", error);
      if (error.response?.status === 403) {
        toast.error("Limit reached! Upgrade to premium to add more.");
      } else {
        toast.error(error.response?.data?.message || "Failed to add recipe. Check console.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6 transition-colors duration-300">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
        Share a New Recipe
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recipe Name</label>
            <input type="text" name="recipeName" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select name="category" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none">
              <option value="">Select Category</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Dessert">Dessert</option>
              <option value="Snack">Snack</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cuisine Type</label>
            <input type="text" name="cuisineType" required onChange={handleChange} placeholder="e.g., Italian, Bengali" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Difficulty Level</label>
            <select name="difficultyLevel" required onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none">
              <option value="">Select Level</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prep Time (mins)</label>
            <input type="number" name="preparationTime" required onChange={handleChange} placeholder="e.g., 30" className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ingredients</label>
          <textarea name="ingredients" required rows="3" onChange={handleChange} placeholder="List ingredients separated by commas..." className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none resize-none"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Instructions</label>
          <textarea name="instructions" required rows="4" onChange={handleChange} placeholder="Step-by-step instructions..." className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none resize-none"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recipe Image</label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-28 object-contain rounded" />
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FiUploadCloud className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload image</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
        </div>

        <button type="submit" disabled={loading} className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-md transition duration-300 disabled:bg-gray-400 flex justify-center items-center gap-2">
          {loading ? "Uploading & Saving..." : "Add Recipe"}
        </button>
      </form>
    </div>
  );
}