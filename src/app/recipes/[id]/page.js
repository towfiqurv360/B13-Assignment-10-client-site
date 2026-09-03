// src/app/recipes/[id]/page.js
"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { axiosSecure } from "@/lib/axios";
import { FaHeart, FaRegHeart, FaBookmark, FaFlag, FaShoppingCart } from "react-icons/fa";

export default function RecipeDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    fetchRecipeDetails();
  }, [id]);

  const fetchRecipeDetails = async () => {
    try {
      const res = await axiosSecure.get(`/recipes/${id}`);
      setRecipe(res.data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      // Assuming backend has a PATCH route for likes: /recipes/:id/like
      await axiosSecure.patch(`/recipes/${id}/like`);
      fetchRecipeDetails(); // Refresh data to show updated likes
    } catch (error) {
      alert("Please login to like this recipe.");
    }
  };

  const handleFavorite = async () => {
    try {
      await axiosSecure.post("/favorites", { recipeId: id });
      alert("Added to favorites!");
    } catch (error) {
      alert("Please login to add to favorites.");
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.post("/reports", { recipeId: id, reason: reportReason });
      alert("Recipe reported successfully.");
      setIsReportModalOpen(false);
      setReportReason("");
    } catch (error) {
      alert("Failed to report recipe.");
    }
  };

  const handlePurchase = () => {
    router.push(`/recipes/${id}/purchase`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading recipe...</div>;
  if (!recipe) return <div className="min-h-screen flex items-center justify-center">Recipe not found!</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Image Section */}
        <div className="w-full h-96 relative">
          <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-full h-full object-cover" />
        </div>

        {/* Details Section */}
        <div className="p-8">
          <div className="flex flex-wrap justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{recipe.recipeName}</h1>
              <p className="text-gray-600">By <span className="font-semibold">{recipe.authorName}</span> | Category: {recipe.category}</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-4 md:mt-0">
              <button onClick={handleLike} className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition">
                <FaHeart /> <span>{recipe.likesCount || 0}</span>
              </button>
              <button onClick={handleFavorite} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                <FaBookmark /> Save
              </button>
              <button onClick={() => setIsReportModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition">
                <FaFlag /> Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="block text-sm text-gray-500">Cuisine</span>
              <span className="font-semibold text-gray-800">{recipe.cuisineType}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="block text-sm text-gray-500">Difficulty</span>
              <span className="font-semibold text-gray-800">{recipe.difficultyLevel}</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <span className="block text-sm text-gray-500">Prep Time</span>
              <span className="font-semibold text-gray-800">{recipe.preparationTime}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Ingredients</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                {recipe.ingredients.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Instructions</h3>
              <ul className="list-decimal pl-5 space-y-3 text-gray-700">
                {recipe.instructions.map((step, index) => (
                  <li key={index} className="pl-2">{step}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Purchase Button */}
          <div className="mt-12 text-center border-t pt-8">
            <button onClick={handlePurchase} className="inline-flex items-center gap-2 bg-orange-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-orange-700 transition transform hover:scale-105">
              <FaShoppingCart /> Buy This Recipe
            </button>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Report Recipe</h3>
            <form onSubmit={handleReport}>
              <select 
                required
                className="w-full border p-2 rounded mb-4 focus:ring-orange-500"
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
              >
                <option value="">Select a reason</option>
                <option value="Spam">Spam</option>
                <option value="Offensive Content">Offensive Content</option>
                <option value="Copyright Issue">Copyright Issue</option>
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Submit Report</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}