"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { FiUser, FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function AllRecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

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
        toast.error("Failed to fetch recipes");
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] transition-colors duration-500 py-16 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-400/10 dark:bg-orange-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-amber-400/10 dark:bg-amber-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-bold uppercase tracking-widest mb-4">
            Discover
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-500 mb-8 drop-shadow-sm tracking-tight">
            Our Culinary Collection
          </h1>
          
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-3xl mx-auto p-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-800/50 shadow-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  selectedCategory === cat
                    ? "bg-gradient-to-r from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/30 transform scale-105"
                    : "bg-transparent text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-orange-500 dark:hover:text-orange-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Curating recipes for you...</p>
          </div>
        ) : recipes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl"
          >
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <FiSearch className="text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No recipes found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              We couldn't find any recipes in the "{selectedCategory}" category at the moment.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {recipes.map((recipe) => (
              <motion.div 
                variants={itemVariants}
                key={recipe._id} 
                className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-gray-100 dark:border-gray-800 transition-all duration-500 group flex flex-col transform hover:-translate-y-1"
              >
                <div className="h-56 overflow-hidden relative">
                  <img 
                    src={recipe.recipeImage || "https://via.placeholder.com/400"} 
                    alt={recipe.recipeName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-10 border border-white/20 dark:border-gray-700/50">
                    <FaHeart className="text-orange-500 text-sm" /> 
                    <span className="text-xs font-extrabold text-gray-900 dark:text-white">
                      {recipe.likesCount || 0}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 z-10">
                    <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                      {recipe.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                    {recipe.recipeName}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-6 text-gray-500 dark:text-gray-400 flex-grow">
                    <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-orange-500">
                      <FiUser className="text-xs" />
                    </div>
                    <span className="text-sm font-semibold truncate">
                      {recipe.authorName}
                    </span>
                  </div>
                  
                  <Link 
                    href={`/recipes/${recipe._id}`} 
                    className="block text-center w-full bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-bold py-3.5 rounded-xl group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-amber-500 group-hover:text-white transition-all duration-300 shadow-sm"
                  >
                    View Recipe
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}