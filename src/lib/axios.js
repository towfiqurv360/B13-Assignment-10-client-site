import axios from "axios";

export const axiosSecure = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true, 
});