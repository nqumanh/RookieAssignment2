import axiosClient from "./axiosClient";

const END_POINT = {
    ASSET: "Assets",
};
//product api
export const getAssetAPI = (assetCode) => {
    return axiosClient.get(END_POINT.ASSET + `/get/${assetCode}`);
};

export const editAssetAPI = (asset) => {
    return axiosClient.put(END_POINT.ASSET, asset);
};
export const deleteAssetAPI = (assetCode) => {
    return axiosClient.put(END_POINT.ASSET + `/delete/${assetCode}`);
};
