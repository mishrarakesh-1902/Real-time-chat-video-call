// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: import.meta.env.MODE === "development" ? "https://real-time-chat1-8hhq.onrender.com/api" : "/api",
//   withCredentials: true,
// });


// import axios from "axios";

// export const axiosInstance = axios.create({
//   baseURL: "https://real-time-chat1-8hhq.onrender.com/api",
//   withCredentials: true,
// });

import axios from "axios";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const BASE_URL = isLocalhost
  ? "http://localhost:3000"
  : "https://real-time-chat1-8hhq.onrender.com";

export const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});
