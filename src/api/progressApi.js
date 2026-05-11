import API from "./axios";
export const getProgress = () => API.get("/progress");
export const getStats = () => API.get("/progress/stats");
export const markVideoComplete = (videoId) => API.post("/progress/video/complete", { videoId });
