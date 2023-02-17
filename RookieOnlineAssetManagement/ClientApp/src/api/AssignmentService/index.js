import axios from "axios";

const BASE_URL = "/api";

const getAxios = (url, params = {}) =>
    axios.get(url, {
        params: params,
    });

const getUsers = (pageNumber, pageSize, field, searchString, sortType) =>
    getAxios(`${BASE_URL}/Users/GetUsers`, {
        PageNumber: pageNumber,
        PageSize: pageSize,
        SearchString: searchString,
        SortBy: field,
        SortType: sortType,
    });

const getAvailableAssets = (
    pageNumber,
    pageSize,
    field,
    searchString,
    sortType,
) =>
    getAxios(`${BASE_URL}/Assets/GetAvailableAssets`, {
        PageNumber: pageNumber,
        PageSize: pageSize,
        SearchString: searchString,
        SortBy: field,
        SortType: sortType,
    });

const getAssignmentById = (id) =>
    getAxios(`${BASE_URL}/Assignments/GetAssignmentById`, {
        id: id,
    });

const createAssignment = (createAssignmentForm) =>
    axios.post(
        `${BASE_URL}/Assignments/CreateAssignment`,
        createAssignmentForm,
    );

export { getUsers, getAvailableAssets, getAssignmentById, createAssignment };
