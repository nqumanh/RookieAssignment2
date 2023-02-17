import axiosClient from "./axiosClient";

const END_POINT = {
  USER: "Users",
};
//product api
export const getUserAPI = (id) => {
  return axiosClient.get(END_POINT.USER + `/${id}`);
};

export const editUserAPI = (user) => {
  return axiosClient.put(END_POINT.USER, user);
};
