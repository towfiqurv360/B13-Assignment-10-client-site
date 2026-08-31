// src/context/AuthContext.js
"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../firebase/firebase.config"; 
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem("user");
      router.push("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed");
    }
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const res = await axios.post("http://localhost:5000/api/auth/google-login", {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        image: firebaseUser.photoURL,
      }, { withCredentials: true });

      if (res.status === 200) {
        login({
          name: res.data.name,
          email: firebaseUser.email,
          role: res.data.role,
          image: res.data.image
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