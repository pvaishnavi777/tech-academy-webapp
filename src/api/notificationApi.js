import API from "./axios";
export const getNotifications = () => API.get("/notifications");
export const markNotificationsRead = () => API.put("/notifications/read");
