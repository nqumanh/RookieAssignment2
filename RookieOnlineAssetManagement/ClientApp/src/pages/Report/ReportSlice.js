import reportApi from "api/reportAPI";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const report = createSlice({
    name: "report",
    initialState: { firstLoading: false, loading: false, total: 0, page: 1, lastPage: 0, reports: [] },
    extraReducers: builder => {
        builder
        .addCase(fetchReportList.pending, (state, action) => {
            state.firstLoading = true;
        })
        .addCase(fetchReportList.fulfilled, (state, action) => {
            state.firstLoading = false;
            state.reports = action.payload.reports;
            state.page = action.payload.page;
            state.total = action.payload.totalItem;
            state.lastPage = action.payload.lastPage;
        })
        .addCase(fetchReportList.rejected, (state, action) => {
            state.firstLoading = false;
            state.reports = [];
            state.page = 0;
            state.total = 0;
            state.lastPage = 0;
        })

        .addCase(fetchReportListPagingSorting.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(fetchReportListPagingSorting.fulfilled, (state, action) => {
            state.loading = false;
            state.reports = action.payload.reports;
            state.page = action.payload.page;
            state.total = action.payload.totalItem;
            state.lastPage = action.payload.lastPage;
        })
        .addCase(fetchReportListPagingSorting.rejected, (state, action) => {
            state.loading = false;
            state.reports = [];
            state.page = 0;
            state.total = 0;
            state.lastPage = 0;
        })
    }

})

const { reducer } = report;
export default reducer;

export const fetchReportList = createAsyncThunk('report/fetchReportList', async (params) => {
    const res = await reportApi.getItemPaging(params);
    return res;
})
export const fetchReportListPagingSorting = createAsyncThunk('report/fetchReportListPagingSorting', async (params) => {
    const res = await reportApi.getItemPaging(params);
    return res;
})