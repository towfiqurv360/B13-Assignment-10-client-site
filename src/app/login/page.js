"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { axiosSecure } from "@/lib/axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { googleSignIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axiosSecure.post("/auth/login", formData);
      if (res.status === 200) {
        
        Cookies.set("token", "logged_in", { expires: 7 }); 
        
        localStorage.setItem("user", JSON.stringify({
          name: res.data.name,
          email: formData.email,
          role: res.data.role,
          image: res.data.image
        }));

        alert("Login successful!");
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
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
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
          <div className="space-y-4">
            <input
              type="email" required placeholder="Email Address"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input
              type="password" required placeholder="Password"
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <div className="mt-4 flex items-center justify-between">
  <span className="border-b w-1/5 lg:w-1/4"></span>
  <span className="text-xs text-center text-gray-500 uppercase">or login with</span>
  <span className="border-b w-1/5 lg:w-1/4"></span>
</div>

<button
  type="button"
  onClick={googleSignIn}
  className="w-full flex items-center justify-center gap-2 mt-4 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition shadow-sm font-medium"
>
  <FcGoogle className="text-xl" />
  Continue with Google
</button>
        </form>
        <div className="text-center text-sm">
          <p className="text-gray-600">Don't have an account? <Link href="/register" className="font-medium text-orange-600 hover:text-orange-500">Register here</Link></p>
        </div>
      </motion.div>
    </div>
  );
}