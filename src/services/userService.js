import axiosInstance from "./api";

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/users/${id}/`);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await axiosInstance.put(`/users/${id}/`, data);
  return response.data;
};

export const partialUpdateUser = async (id, data) => {
  const response = await axiosInstance.patch(`/users/${id}/`, data);
  return response.data;
};
