"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { axiosSecure } from "@/lib/axios";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", image: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
     
      const res = await axiosSecure.post("/auth/register", formData);
      if (res.status === 201) {
        alert("Registration successful! Please login.");
        router.push("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
        className="max-w-md w-full bg-white p-8 rounded-xl shadow-md space-y-8"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
          <div className="space-y-4">
            <input
              type="text" required placeholder="Full Name"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email" required placeholder="Email Address"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="text" placeholder="Profile Image URL (Optional)"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            <input
              type="password" required placeholder="Password (Min 6 chars, 1 Uppercase, 1 Lowercase)"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className="text-center text-sm">
          <p className="text-gray-600">Already have an account? <Link href="/login" className="font-medium text-orange-600 hover:text-orange-500">Log in</Link></p>
        </div>
      </motion.div>
    </div>
  );
}