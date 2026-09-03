import axios from "axios";

const isProduction = process.env.NODE_ENV === "production";
const liveServerUrl = "https://b13-assignment-10-server-site.onrender.com/api";
const localServerUrl = "http://localhost:5000/api";

export const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL || (isProduction ? liveServerUrl : localServerUrl),
  withCredentials: true, 
});