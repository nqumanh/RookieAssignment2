import axiosClient from "./axiosClient";

const reportApi = {
    getItemPaging: (params) => {
        const url = '/Assets/GetReport';
        return axiosClient.get(url, { params });
    },
};
export default reportApi;
