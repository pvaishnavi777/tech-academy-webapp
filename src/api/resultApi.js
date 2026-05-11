import API from "./axios";
export const getMyResults = () => API.get("/results");
export const getResult = (id) => API.get(`/results/${id}`);
