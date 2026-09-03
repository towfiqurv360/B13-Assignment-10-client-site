import axios from "axios";

export const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000/api",
  withCredentials: true, 
});