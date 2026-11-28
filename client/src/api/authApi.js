import api from "./axios.js";

export const registerUser = async (formData) => {
  const { confirmPassword, fullName, ...rest } = formData;
  const payload = { ...rest, name: fullName };
  const response = await api.post("/user/register", payload);
  return response.data;
};

export const loginUser = async (formData) => {
  const response = await api.post("/user/login", formData);
  return response.data;
};

export const logoutUser = async () => {
  await api.post("/user/logout");
};
