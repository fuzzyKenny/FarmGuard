import axios from "axios";
import * as SecureStore from "expo-secure-store";

const backendURL = "https://ai-crop-health.onrender.com";

// Create axios instance
// const api = axios.create({
//   baseURL: backendURL,
// });

// Attach token before each request
// api.interceptors.request.use(async (config) => {
//   try {
//     const token = await SecureStore.getItemAsync("authToken");
//     if (token) {
//       config.headers.authorization = `Bearer ${token}`;
//     }
//   } catch (err) {
//     console.error("Error reading token from SecureStore:", err);
//   }
//   return config;
// });

export default {} as any;
