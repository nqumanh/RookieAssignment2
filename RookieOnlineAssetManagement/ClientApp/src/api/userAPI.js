import axiosClient from "./axiosClient";

const userApi = {
  getAll: () => {
    const url = "/Users/GetAll";
    return axiosClient.get(url);
  },
  getCurrentUser: () => {
    const url = "/Users";
    return axiosClient.get(url); 
  },
  getUsers: (pageNumber, pageSize) => {
    const url = `/api/User/GetUsers?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    return axiosClient.get(url)
  }

  // edit, remove, ...
}
export default userApi;