import assetApi from "api/assetAPI";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const asset = createSlice({
    name: "assets",
    initialState: { loading: false, assets: [],total:0},
    reducers: {
        loadAsset: (state, action) => {
            state.assets = action.payload.assetList;
            state.total = action.payload.assetTotal;
        }
    },
    extraReducers: builder => {
        builder
            .addCase(fetchAssets.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchAssets.fulfilled,  (state, action) => {
                state.loading = false;
                state.assets = action.payload.assetList;
                state.total = action.payload.assetTotal;
            })
            .addCase(fetchAssets.rejected,  (state, action) => {
                state.loading = false;
                state.assets = [];
                state.total = 0;
            })
    }
})
const { reducer, actions } = asset;
export const { loadAsset } = actions;
export default reducer;

export const fetchAssets = createAsyncThunk('assets/fetchAssets', async (data) => {
    const res = await assetApi.getListAsset(data.currentPage,data.strFilterByState, data.strFilterByCategory, data.searchString, data.sort, data.sortBy);
    return res;
})