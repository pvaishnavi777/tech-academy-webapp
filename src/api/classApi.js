import API from "./axios";
export const getClasses = () => API.get("/classes");
export const getClass = (id) => API.get(`/classes/${id}`);
export const createClass = (data) => API.post("/classes", data);
export const updateClass = (id, data) => API.put(`/classes/${id}`, data);
export const deleteClass = (id) => API.delete(`/classes/${id}`);
