import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  // Without this set, requests fall back to the current origin, which on
  // Vercel gets caught by the SPA rewrite and returns index.html instead of
  // JSON — causing confusing crashes like "x.map is not a function".
  console.warn(
    "[EventHub] VITE_API_URL is not set. Set it in your deployment's " +
      "environment variables to your backend URL, e.g. https://your-backend.onrender.com/api"
  );
}

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("eventhub_user"));
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export default api;
