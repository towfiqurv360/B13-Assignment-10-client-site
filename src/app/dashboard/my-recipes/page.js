// src/app/dashboard/my-recipes/page.js
"use client";
import { useEffect, useState } from "react";
import { axiosSecure } from "@/lib/axios";
import Link from "next/link";
import { FaTrash, FaEdit } from "react-icons/fa";

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
      console.error("Failed to fetch recipes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      try {
        await axiosSecure.delete(`/recipes/${id}`);
        alert("Recipe deleted successfully");
        fetchMyRecipes(); 
      } catch (error) {
        alert("Failed to delete recipe");
      }
    }
  };

  if (loading) return <div>Loading your recipes...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">My Recipes</h2>
      
      {recipes.length === 0 ? (
        <p className="text-gray-500">You haven't added any recipes yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 border-b">Image</th>
                <th className="p-4 border-b">Recipe Name</th>
                <th className="p-4 border-b">Category</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4">
                    <img src={recipe.recipeImage} alt={recipe.recipeName} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="p-4 font-medium text-gray-800">{recipe.recipeName}</td>
                  <td className="p-4 text-gray-600">{recipe.category}</td>
                  <td className="p-4 flex gap-3">
                    <Link href={`/recipes/${recipe._id}`} className="text-blue-500 hover:text-blue-700 text-sm font-medium">View</Link>
                    <button onClick={() => handleDelete(recipe._id)} className="text-red-500 hover:text-red-700" title="Delete">
                      <FaTrash />
                    </button>
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