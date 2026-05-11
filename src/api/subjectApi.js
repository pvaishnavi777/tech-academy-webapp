import API from "./axios";
export const getSubjects = (classId) => API.get("/subjects", { params: { classId } });
export const getSubject = (id) => API.get(`/subjects/${id}`);
export const createSubject = (data) => API.post("/subjects", data);
export const updateSubject = (id, data) => API.put(`/subjects/${id}`, data);
export const deleteSubject = (id) => API.delete(`/subjects/${id}`);
