// src/app/dashboard/manage-recipes/page.js
"use client";
import { useEffect, useState } from "react";
import { axiosSecure } from "@/lib/axios";
import toast from "react-hot-toast";
import { FaTrash, FaEdit, FaStar } from "react-icons/fa";
import Link from "next/link";

export default function ManageRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllRecipes();
  }, []);

  const fetchAllRecipes = async () => {
    try {
      const res = await axiosSecure.get("/recipes");
      const recipeData = Array.isArray(res.data) 
        ? res.data 
        : res.data?.recipes || res.data?.data || [];
      setRecipes(recipeData);
    } catch (error) {
      toast.error("Failed to load recipes");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this recipe permanently?")) {
      try {
        await axiosSecure.delete(`/recipes/${id}`);
        toast.success("Recipe deleted successfully");
        fetchAllRecipes(); 
      } catch (error) {
        toast.error("Failed to delete recipe");
      }
    }
  };

  const handleFeature = async (id, currentStatus) => {
    try {
      await axiosSecure.patch(`/recipes/feature/${id}`, { isFeatured: !currentStatus });
      toast.success(currentStatus ? "Removed from Featured" : "Added to Featured Recipes!");
      fetchAllRecipes();
    } catch (error) {
      toast.error("Failed to update feature status");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-h-screen transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-4">
        Manage All Recipes
      </h2>
      
      {Array.isArray(recipes) && recipes.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No recipes found in the database.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wider">
                <th className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold">Recipe Name</th>
                <th className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold">Author</th>
                <th className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold">Category</th>
                <th className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-center">Likes</th>
                <th className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-center">Featured</th>
                <th className="p-4 border-b border-gray-200 dark:border-gray-700 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {Array.isArray(recipes) && recipes.map((recipe) => (
                <tr key={recipe._id} className="hover:bg-orange-50/50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="p-4 font-medium text-gray-900 dark:text-white flex items-center gap-4">
                    <img 
                      src={recipe.recipeImage || "https://via.placeholder.com/150"} 
                      alt={recipe.recipeName} 
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200 dark:border-gray-600 shadow-sm" 
                    />
                    <span className="line-clamp-1">{recipe.recipeName}</span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300">{recipe.authorName || "Unknown"}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                      {recipe.category}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-300 font-semibold text-center">
                    {recipe.likesCount || 0}
                  </td>
                  <td className="p-4 text-center">
                    {/* Feature Button */}
                    <button 
                      onClick={() => handleFeature(recipe._id, recipe.isFeatured)}
                      className={`p-2 rounded-full transition-colors ${recipe.isFeatured ? 'bg-yellow-100 text-yellow-500 dark:bg-yellow-900/30' : 'bg-gray-100 text-gray-400 hover:bg-yellow-50 hover:text-yellow-500 dark:bg-gray-700 dark:hover:bg-gray-600'}`}
                      title={recipe.isFeatured ? "Remove from Featured" : "Make Featured"}
                    >
                      <FaStar className="text-lg" />
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      {/* Edit Button[cite: 3] */}
                      <Link 
                        href={`/dashboard/manage-recipes/edit/${recipe._id}`}
                        className="text-blue-500 hover:text-white hover:bg-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:hover:bg-blue-600 p-2.5 rounded-lg transition-all shadow-sm"
                        title="Edit Recipe"
                      >
                        <FaEdit />
                      </Link>

                      {/* Delete Button */}
                      <button 
                        onClick={() => handleDelete(recipe._id)} 
                        className="text-red-500 hover:text-white hover:bg-red-500 bg-red-50 dark:bg-red-500/10 dark:hover:bg-red-600 p-2.5 rounded-lg cursor-pointer transition-all shadow-sm"
                        title="Delete Recipe"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}