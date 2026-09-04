import axios from "axios";

const isProduction = process.env.NODE_ENV === "production";
const liveServerUrl = "https://b13-assignment-10-server-site.onrender.com/api";
const localServerUrl = "http://localhost:5000/api";

let envBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
if (envBaseUrl && !envBaseUrl.endsWith('/api')) {
  envBaseUrl = `${envBaseUrl}/api`;
}

export const axiosSecure = axios.create({
  baseURL: envBaseUrl || (isProduction ? liveServerUrl : localServerUrl),
  withCredentials: true,
});