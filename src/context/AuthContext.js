"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase/firebase.config"; 
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { axiosSecure } from "../lib/axios"; 
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user data", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axiosSecure.post(`/auth/logout`);
    } catch (error) {
      console.error("Server logout error:", error);
    } finally {
      
      setUser(null);
      localStorage.removeItem("user");
      toast.success("Logged out successfully");
      router.push("/login");
      setLoading(false);
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const res = await axiosSecure.post(`/auth/google-login`, {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        image: firebaseUser.photoURL,
      });

      if (res.status === 200) {
        
        const userData = res.data.user;
        login({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          image: userData.image,
          isPremium: userData.isPremium
        });
        toast.success("Google Login Successful!");
        router.push("/");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      toast.error("Google login failed!");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, googleSignIn, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);