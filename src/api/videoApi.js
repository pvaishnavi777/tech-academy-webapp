import API from "./axios";
export const getVideos = (chapterId) => API.get("/videos", { params: { chapterId } });
export const getVideo = (id) => API.get(`/videos/${id}`);
export const createVideo = (data) => API.post("/videos", data);
export const updateVideo = (id, data) => API.put(`/videos/${id}`, data);
export const deleteVideo = (id) => API.delete(`/videos/${id}`);
