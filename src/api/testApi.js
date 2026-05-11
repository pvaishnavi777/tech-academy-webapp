import API from "./axios";
export const getTests = (chapterId) => API.get("/tests", { params: { chapterId } });
export const getTest = (id) => API.get(`/tests/${id}`);
export const submitTest = (id, data) => API.post(`/tests/${id}/submit`, data);
export const createTest = (data) => API.post("/tests", data);
export const updateTest = (id, data) => API.put(`/tests/${id}`, data);
export const deleteTest = (id) => API.delete(`/tests/${id}`);
