"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { 
  FaChartPie, FaUtensils, FaPlusCircle, FaHeart, 
  FaShoppingBag, FaUserAlt, FaCrown, FaUsers, 
  FaFlag, FaMoneyBillWave 
} from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const userLinks = [
    { name: "Overview", path: "/dashboard", icon: <FaChartPie /> },
    { name: "My Recipes", path: "/dashboard/my-recipes", icon: <FaUtensils /> },
    { name: "Add Recipe", path: "/dashboard/add-recipe", icon: <FaPlusCircle /> },
    { name: "My Favorites", path: "/dashboard/favorites", icon: <FaHeart /> },
    { name: "Purchased Recipes", path: "/dashboard/purchased", icon: <FaShoppingBag /> },
    { name: "Profile", path: "/dashboard/profile", icon: <FaUserAlt /> },
    { name: "Upgrade Premium", path: "/dashboard/premium", icon: <FaCrown className="text-amber-500" /> },
  ];

  const adminLinks = [
    { name: "Admin Dashboard", path: "/dashboard", icon: <FaChartPie /> },
    { name: "Manage Users", path: "/dashboard/manage-users", icon: <FaUsers /> },
    { name: "Manage Recipes", path: "/dashboard/manage-recipes", icon: <FaUtensils /> },
    { name: "Manage Reports", path: "/dashboard/reports", icon: <FaFlag /> },
    // 🔥 ট্রানজেকশন পেজের লিংক যুক্ত করা হয়েছে
    { name: "Transactions", path: "/dashboard/transactions", icon: <FaMoneyBillWave className="text-green-500" /> }, 
    { name: "Profile", path: "/dashboard/profile", icon: <FaUserAlt /> },
  ];

  const linksToShow = user?.role === "admin" ? adminLinks : userLinks;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50/50 dark:bg-gray-950 transition-colors duration-500 font-sans">
      
      {/* Premium Glassmorphism Sidebar */}
      <aside className="w-full md:w-72 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/50 flex flex-col flex-shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 transition-all duration-500">
        
        {/* Sidebar Header */}
        <div className="p-8 border-b border-gray-200/50 dark:border-gray-800/50 text-center md:text-left">
          <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-500 tracking-tight drop-shadow-sm">
            Dashboard
          </h2>
          <div className="inline-block mt-3 px-4 py-1.5 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700">
            <p className="text-xs font-extrabold text-gray-600 dark:text-gray-300 uppercase tracking-widest">
              {user?.role === "admin" ? "Admin Panel" : "User Panel"}
            </p>
          </div>
        </div>
        
        {/* Sidebar Navigation */}
        <nav className="flex-1 py-8 px-5 overflow-y-auto">
          <ul className="space-y-2.5">
            {linksToShow.map((link) => {
              const isActive = pathname === link.path;
              
              return (
                <li key={link.name}>
                  <Link 
                    href={link.path}
                    className={`group flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 ease-out text-sm font-bold ${
                      isActive 
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-[1.02]" 
                        : "text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-orange-600 dark:hover:text-orange-400 hover:shadow-md hover:scale-[1.02]"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon with smooth color transition */}
                      <span className={`text-lg transition-colors duration-300 ${isActive ? "text-white" : "text-gray-400 group-hover:text-orange-500"}`}>
                        {link.icon}
                      </span>
                      
                      {/* Text */}
                      <span className="tracking-wide">
                        {link.name}
                      </span>
                    </div>

                    {/* Active Indicator Dot (Right side) */}
                    <span className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      isActive ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "bg-transparent"
                    }`}></span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {/* Premium Footer inside Sidebar */}
        <div className="p-6 border-t border-gray-200/50 dark:border-gray-800/50 hidden md:block bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/50">
          <p className="text-xs text-center text-gray-400 dark:text-gray-500 font-semibold tracking-wider">
            &copy; {new Date().getFullYear()} RecipeHub Pro
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-12 relative overflow-y-auto">
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-orange-50/50 to-transparent dark:from-orange-900/5 dark:to-transparent pointer-events-none -z-10"></div>
        
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}