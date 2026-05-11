import API from "./axios";

// Get all courses
export const getCourses = () => API.get("/courses");

// Create course (admin only)
export const createCourse = (data) => API.post("/courses", data);