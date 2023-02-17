import axios from "axios";

const BASE_URL = "/api";

const getAxios = (url, params = {}) =>
    axios.get(url, {
        params: params,
    });

const getReturningRequests = (
    filterState,
    returnedDate,
    searchString,
    field,
    sortType,
    pageSize,
    pageNumber,
) => getAxios(`${BASE_URL}/ReturningRequests/getReturningRequests`, {
    filterState: filterState,
    ReturnedDate: returnedDate,
    SearchString: searchString,
    SortBy: field,
    SortType: sortType,
    PageNumber: pageNumber,
    PageSize: pageSize,
});

const cancelReturningRequest = (requestId) => {
    return axios.put(`${BASE_URL}/ReturningRequests/CancelReturningRequest/${requestId}`)
}

export { getReturningRequests, cancelReturningRequest };