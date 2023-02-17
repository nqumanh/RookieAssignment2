import axiosClient from "./axiosClient";

const assetApi = {
    getListAsset: (currentPage, filterByState, filterByCategory, searchString, sort, sortBy) => {
        const url = `/Assets/${currentPage}/${filterByState}/${filterByCategory}/${searchString}/${sort}/${sortBy}`;
        return axiosClient.get(url);
    },

    // edit, remove, ...
}
export default assetApi;