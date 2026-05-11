import API from "./axios";
export const getChapters = (subjectId) => API.get("/chapters", { params: { subjectId } });
export const getChapter = (id) => API.get(`/chapters/${id}`);
export const createChapter = (data) => API.post("/chapters", data);
export const updateChapter = (id, data) => API.put(`/chapters/${id}`, data);
export const deleteChapter = (id) => API.delete(`/chapters/${id}`);
