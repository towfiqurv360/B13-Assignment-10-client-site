"use client";
import { useEffect, useState } from "react";
import { axiosSecure } from "@/lib/axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiTrash2, FiEye, FiBookOpen, FiPlus, FiEdit } from "react-icons/fi";

export default function MyRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  const fetchMyRecipes = async () => {
    try {
      const res = await axiosSecure.get("/recipes/my-recipes");
      setRecipes(res.data);
    } catch (error) {
      toast.error("Failed to fetch your recipes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      try {
        await axiosSecure.delete(`/recipes/${id}`);
        toast.success("Recipe deleted successfully!");
        fetchMyRecipes(); 
      } catch (error) {
        toast.error("Failed to delete recipe");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-500/30 text-white">
            <FiBookOpen className="text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">My Recipes</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and view all your published recipes.</p>
          </div>
        </div>
        
        <Link 
          href="/dashboard/add-recipe"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
        >
          <FiPlus className="text-lg" />
          Add New Recipe
        </Link>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden"
      >
        {recipes.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-orange-50 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-6 text-orange-400 dark:text-orange-500">
              <FiBookOpen className="text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No recipes found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              You haven't created any recipes yet. Start sharing your culinary masterpieces with the world!
            </p>
            <Link 
              href="/dashboard/add-recipe"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-200 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-400 font-bold rounded-xl transition-colors duration-300"
            >
              <FiPlus />
              Create Your First Recipe
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                  <th className="p-6 font-semibold">Recipe Details</th>
                  <th className="p-6 font-semibold">Category</th>
                  <th className="p-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {recipes.map((recipe) => (
                  <tr key={recipe._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img 
                          src={recipe.recipeImage || "https://via.placeholder.com/150"} 
                          alt={recipe.recipeName} 
                          className="w-16 h-16 rounded-xl object-cover border-2 border-gray-100 dark:border-gray-700 shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-base">{recipe.recipeName}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">ID: {recipe._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-6">
                      <span className="inline-flex px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-bold uppercase rounded-lg border border-gray-200 dark:border-gray-700">
                        {recipe.category || "Uncategorized"}
                      </span>
                    </td>
                    
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/recipes/${recipe._id}`} 
                          className="p-2 text-blue-500 hover:text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-colors duration-300"
                          title="View Recipe"
                        >
                          <FiEye className="text-lg" />
                        </Link>
                        <Link 
                          href={`/dashboard/edit-recipe/${recipe._id}`} 
                          className="p-2 text-green-500 hover:text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40 rounded-lg transition-colors duration-300"
                          title="Edit Recipe"
                        >
                          <FiEdit className="text-lg" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(recipe._id)} 
                          className="p-2 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors duration-300"
                          title="Delete Recipe"
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}