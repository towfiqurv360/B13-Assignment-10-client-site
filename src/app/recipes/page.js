"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";

export default function AllRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snack"];

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const url = selectedCategory && selectedCategory !== "All" 
          ? `http://localhost:5000/api/recipes?category=${selectedCategory}`
          : "http://localhost:5000/api/recipes";
          
        const res = await axios.get(url);
        
        const fetchedData = Array.isArray(res.data) 
          ? res.data 
          : (res.data?.data || res.data?.recipes || []);
          
        setRecipes(fetchedData);
      } catch (error) {
        console.error("Failed to fetch recipes", error);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 mb-8 drop-shadow-sm">
            Browse All Recipes
          </h1>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:-translate-y-1 ${
                  (selectedCategory === cat) || (!selectedCategory && cat === "All")
                    ? "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-lg shadow-orange-500/40"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-orange-500 hover:text-orange-500 hover:shadow-md"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Recipe Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-orange-600 shadow-lg"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <p className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
              No recipes found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {recipes.map((recipe) => (
              <div 
                key={recipe._id} 
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-gray-100 dark:border-gray-700 transition-all duration-300 group flex flex-col"
              >
                <div className="h-52 overflow-hidden relative">
                  <img 
                    src={recipe.recipeImage || "https://via.placeholder.com/400"} 
                    alt={recipe.recipeName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* 🔥 FIX: এটিকে বাটন থেকে Read-only <div> এ পরিবর্তন করা হয়েছে */}
                  <div 
                    className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm z-10 border border-gray-100 dark:border-gray-700 cursor-default"
                  >
                    <FaHeart className="text-pink-500 text-sm drop-shadow-md" /> 
                    <span className="text-xs font-bold text-gray-800 dark:text-white">
                      {recipe.likesCount || 0}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-orange-600 dark:text-orange-400 text-xs font-extrabold uppercase tracking-widest mb-2 block">
                    {recipe.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {recipe.recipeName}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 flex-grow font-medium">
                    By {recipe.authorName}
                  </p>
                  
                  <Link 
                    href={`/recipes/${recipe._id}`} 
                    className="block text-center w-full bg-orange-50 dark:bg-gray-700/50 text-orange-600 dark:text-orange-400 font-bold py-3 rounded-xl hover:bg-orange-600 hover:text-white dark:hover:bg-orange-500 dark:hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}