"use client";
import { useEffect, useState } from "react";

export default function DashboardOverview() {
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  if (!mounted) return null; 

  const userRole = user?.role || "user";
  const userName = user?.name || "User";

  return (
    <div className="p-4 sm:p-6 w-full max-w-full overflow-hidden">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 break-words text-gray-800 dark:text-white">
        Welcome, {userName}!
      </h1>
      
      {/* User Premium Badge Requirement */}
      {userRole !== "admin" && (
        <div className="mb-6 p-4 sm:p-5 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-lg shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <p className="font-semibold text-orange-800 dark:text-orange-300 text-sm sm:text-base">
              Membership Status: <span className="uppercase font-bold">{user?.isPremium ? "Premium Member" : "Normal User"}</span>
            </p>
            {!user?.isPremium && (
              <p className="text-xs sm:text-sm text-orange-600 dark:text-orange-400 mt-1.5">
                Upgrade to premium to add unlimited recipes!
              </p>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col items-center sm:items-start transition-all hover:shadow-lg">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-wider">Total Recipes</h3>
          <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">0</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col items-center sm:items-start transition-all hover:shadow-lg">
          <h3 className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-wider">Favorites</h3>
          <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">0</p>
        </div>

        {userRole === "admin" && (
          <div className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-md border border-indigo-100 dark:border-indigo-900/50 flex flex-col items-center sm:items-start transition-all hover:shadow-lg">
            <h3 className="text-indigo-500 dark:text-indigo-400 text-xs sm:text-sm font-bold uppercase tracking-wider">Total Users</h3>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-900 dark:text-indigo-100 mt-2">0</p>
          </div>
        )}
      </div>
    </div>
  );
}