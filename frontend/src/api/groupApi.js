import api from "./axios";

export const getGroups = async () => {
  const response = await api.get("/api/groups");
  return response.data;
};