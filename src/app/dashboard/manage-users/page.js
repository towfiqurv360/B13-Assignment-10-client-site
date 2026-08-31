// src/app/dashboard/manage-users/page.js
"use client";
import { useEffect, useState } from "react";
import { axiosSecure } from "@/lib/axios";
import toast from "react-hot-toast";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axiosSecure.get("/users");
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load users. Are you an Admin?");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (id, newRole) => {
    if (!confirm(`Are you sure you want to make this user an ${newRole}?`)) return;
    try {
      await axiosSecure.patch(`/users/${id}`, { role: newRole });
      toast.success(`User role updated to ${newRole}`);
      fetchUsers(); 
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleMakePremium = async (id, currentStatus) => {
    const action = currentStatus ? "remove" : "grant";
    if (!confirm(`Are you sure you want to ${action} premium status?`)) return;
    try {
      await axiosSecure.patch(`/users/${id}`, { isPremium: !currentStatus });
      toast.success(`Premium status updated`);
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update premium status");
    }
  };

  if (loading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Users</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 border-b">Name</th>
              <th className="p-4 border-b">Email</th>
              <th className="p-4 border-b">Role</th>
              <th className="p-4 border-b">Premium</th>
              <th className="p-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                <td className="p-4 font-medium">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.isPremium ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                    {user.isPremium ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => handleUpdateRole(user._id, 'admin')}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition"
                    >
                      Make Admin
                    </button>
                  )}
                  <button 
                    onClick={() => handleMakePremium(user._id, user.isPremium)}
                    className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition"
                  >
                    {user.isPremium ? 'Remove Premium' : 'Make Premium'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}