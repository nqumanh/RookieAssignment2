import axiosClient from "./axiosClient";

const assignmentApi = {
    getAll: (params) => {
        const url = '/Assignments/GetAssignmentsOfUser';
        return axiosClient.get(url, { params });
    },
    getAssignmentDetail: (id) => {
        const url = `/Assignments/${id}`;
        return axiosClient.get(url);
    },
    AcceptAssignment: (id) => {
        const url = `/Assignments/AcceptAssignment/${id}`;
        return axiosClient.get(url);
    },
    DeclineAssignment: (id) => {
        const url = `/Assignments/DeclineAssignment/${id}`;
        return axiosClient.get(url);
    },
    ReturnAssignment: (id) => {
        const url = `/ReturningRequests/CreateReturningRequest/${id}`;
        return axiosClient.post(url);
    },
    GetAssignmentNumberAfterFilter: (filters) => {
        const url = "/Assignments/GetAssignmentNumberAfterFilter";
        return axiosClient.post(url, filters);
    },

    GetAssignmentsByFilters: (filters, pageNumber, pageSize) => {
        const url = `/Assignments/GetAssignmentsByFilters?pageNumber=${pageNumber}&pageSize=${pageSize}`;
        return axiosClient.post(url, filters);
    }
    // edit, remove, ...
};
export default assignmentApi;