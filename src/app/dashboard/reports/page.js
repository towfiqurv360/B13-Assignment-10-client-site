// src/app/dashboard/reports/page.js
"use client";
import { useEffect, useState } from "react";
import { axiosSecure } from "@/lib/axios";
import toast from "react-hot-toast";
import Link from "next/link";
import { FaCheckCircle, FaTrash } from "react-icons/fa";

export default function ManageReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axiosSecure.get("/reports");
      setReports(res.data);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = async (id) => {
    if (!confirm("Are you sure you want to dismiss this report?")) return;
    try {
      await axiosSecure.delete(`/reports/${id}`);
      toast.success("Report dismissed");
      fetchReports();
    } catch (error) {
      toast.error("Failed to dismiss report");
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    if (!confirm("Are you sure you want to delete this RECIPE permanently?")) return;
    try {
      await axiosSecure.delete(`/recipes/${recipeId}`);
      toast.success("Recipe deleted due to report");
      fetchReports();
    } catch (error) {
      toast.error("Failed to delete recipe");
    }
  };

  if (loading) return <div className="p-6">Loading reports...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Manage Reports</h2>
      
      {reports.length === 0 ? (
        <p className="text-gray-500">Good news! No active reports right now.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4 border-b">Recipe</th>
                <th className="p-4 border-b">Reason</th>
                <th className="p-4 border-b">Reported By</th>
                <th className="p-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4">
                    {report.recipeId ? (
                      <Link href={`/recipes/${report.recipeId._id}`} className="text-blue-600 hover:underline font-medium">
                        {report.recipeId.recipeName}
                      </Link>
                    ) : (
                      <span className="text-red-500 line-through">Recipe Deleted</span>
                    )}
                  </td>
                  <td className="p-4 font-semibold text-red-600">{report.reason}</td>
                  <td className="p-4 text-sm text-gray-600">
                    {report.userId?.name || "Unknown User"}
                  </td>
                  <td className="p-4 flex gap-3">
                    <button 
                      onClick={() => handleDismiss(report._id)}
                      className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 transition text-sm font-bold"
                    >
                      <FaCheckCircle /> Dismiss
                    </button>
                    {report.recipeId && (
                      <button 
                        onClick={() => handleDeleteRecipe(report.recipeId._id)}
                        className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition text-sm font-bold"
                      >
                        <FaTrash /> Delete Recipe
                      </button>
                    )}
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