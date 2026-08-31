"use client";
import { useEffect, useState } from "react";

export default function DashboardOverview() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome, {user?.name || "User"}!</h1>
      
      {/* User Premium Badge Requirement */}
      {user?.role === "user" && (
        <div className="mb-6 p-4 bg-orange-100 border-l-4 border-orange-500 rounded">
          <p className="font-semibold text-orange-800">
            Membership Status: <span className="uppercase">{user?.isPremium ? "Premium Member" : "Normal User"}</span>
          </p>
          {!user?.isPremium && (
            <p className="text-sm text-orange-700 mt-1">Upgrade to premium to add unlimited recipes!</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-gray-500 text-sm font-medium">Total Recipes</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border">
          <h3 className="text-gray-500 text-sm font-medium">Favorites</h3>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        {user?.role === "admin" && (
          <div className="bg-white p-6 rounded-lg shadow border">
            <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
            <p className="text-3xl font-bold mt-2">0</p>
          </div>
        )}
      </div>
    </div>
  );
}
