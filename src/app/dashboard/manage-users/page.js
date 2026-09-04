"use client";
import { useEffect, useState } from "react";
import { axiosSecure } from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { FiUsers, FiShield, FiAward, FiStar, FiXCircle } from "react-icons/fi";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser, updateUserProfile } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get("/users");
      setUsers(res.data);
    } catch (error) {
      // ডায়নামিক এরর মেসেজ অ্যাড করা হয়েছে
      const errorMsg = error.response?.data?.message || "Failed to load users. Are you an Admin?";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (targetUser, newRole) => {
    if (!confirm(`Are you sure you want to make this user an ${newRole}?`)) return;
    try {
      await axiosSecure.patch(`/users/${targetUser._id}`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      
      if (currentUser && currentUser.email === targetUser.email) {
        updateUserProfile({ role: newRole });
      }
      
      fetchUsers(); 
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update role";
      toast.error(errorMsg);
    }
  };

  const handleMakePremium = async (targetUser, currentStatus) => {
    const action = currentStatus ? "remove" : "grant";
    if (!confirm(`Are you sure you want to ${action} premium status?`)) return;
    try {
      await axiosSecure.patch(`/users/${targetUser._id}`, { isPremium: !currentStatus });
      toast.success(`Premium status updated`);

      if (currentUser && currentUser.email === targetUser.email) {
        updateUserProfile({ isPremium: !currentStatus });
      }

      fetchUsers();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to update premium status";
      toast.error(errorMsg);
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
      <div className="mb-8 flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl shadow-lg shadow-orange-500/30 text-white">
          <FiUsers className="text-2xl" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Manage Users</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View and manage user roles and premium access.</p>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-900/80 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl shadow-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                <th className="p-6 font-semibold">User Details</th>
                <th className="p-6 font-semibold">Role</th>
                <th className="p-6 font-semibold">Status</th>
                <th className="p-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors duration-200">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={u.image || "https://via.placeholder.com/150"} 
                        alt={u.name} 
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-base">{u.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                      u.role === 'admin' 
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800' 
                        : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800'
                    }`}>
                      <FiShield className={u.role === 'admin' ? "text-indigo-500" : "text-blue-500"} />
                      {u.role}
                    </span>
                  </td>
                  
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                      u.isPremium 
                        ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                    }`}>
                      <FiAward className={u.isPremium ? "text-amber-500" : "text-gray-400"} />
                      {u.isPremium ? 'Premium' : 'Standard'}
                    </span>
                  </td>
                  
                  <td className="p-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {u.role !== 'admin' && (
                        <button 
                          onClick={() => handleUpdateRole(u, 'admin')}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-sm font-semibold rounded-xl transition-all duration-300"
                        >
                          <FiShield /> Make Admin
                        </button>
                      )}
                      <button 
                        onClick={() => handleMakePremium(u, u.isPremium)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
                          u.isPremium
                            ? "bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400"
                            : "bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {u.isPremium ? <FiXCircle /> : <FiStar />}
                        {u.isPremium ? 'Remove Premium' : 'Make Premium'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              No users found.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}