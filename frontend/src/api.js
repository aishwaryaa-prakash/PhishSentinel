import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Example calls
export const registerUser = (data) => API.post("/auth/register", data);
export const loginUser = (data) => API.post("/auth/login", data);
export const scanUrl = (params) => API.get("/scan/url", { params });
export const getCommunityProfile = (username) => API.get(`/community/profile/${username}`);
