import assignmentApi from "api/assignmentApi";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initAssignment = {
    assetCode: '',
    assetName: '',
    specification: '',
    assignedTo: '',
    assignedBy: '',
    assignedDate: '',
    state: '',
    note: ''
}
const home = createSlice({
    name: "home",
    initialState: { loadingSortingPaging: false, loading: false, total: 0, page: 1, lastPage: 0, assignments: [], assignment: initAssignment, returnRequestAssignmentId: 0 },

    extraReducers: builder => {
        builder
            .addCase(fetchAssignments.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchAssignments.fulfilled, (state, action) => {
                state.loading = false;
                state.assignments = action.payload.assignments;
                state.page = action.payload.page;
                state.total = action.payload.totalItem;
                state.lastPage = action.payload.lastPage;
            })
            .addCase(fetchAssignments.rejected, (state, action) => {
                state.loading = false;
                state.assignments = [];
                state.page = 0;
                state.total = 0;
                state.lastPage = 0;
            })

            .addCase(fetchAssignmentsSortingPaging.pending, (state, action) => {
                state.loadingSortingPaging = true;
            })
            .addCase(fetchAssignmentsSortingPaging.fulfilled, (state, action) => {
                state.loadingSortingPaging = false;
                state.assignments = action.payload.assignments;
                state.page = action.payload.page;
                state.total = action.payload.totalItem;
                state.lastPage = action.payload.lastPage;
            })
            .addCase(fetchAssignmentsSortingPaging.rejected, (state, action) => {
                state.loadingSortingPaging = false;
                state.assignments = [];
                state.page = 0;
                state.total = 0;
                state.lastPage = 0;
            })

            .addCase(fetchAssignmentDetail.fulfilled, (state, action) => {
                state.assignment = action.payload;
            })
            .addCase(fetchAssignmentDetail.rejected, (state, action) => {
                state.assignment = initAssignment;
            })

            .addCase(acceptAssignment.pending, (state, action) => {
                state.loadingSortingPaging = true;
            })
            .addCase(acceptAssignment.fulfilled, (state, action) => {
                state.loadingSortingPaging = false;
                state.assignments = action.payload.assignments;
            })
            .addCase(acceptAssignment.rejected, (state, action) => {
                state.loadingSortingPaging = true;
                state.assignments = [];
            })

            .addCase(declineAssignment.pending, (state, action) => {
                state.loadingSortingPaging = true;
            })
            .addCase(declineAssignment.fulfilled, (state, action) => {
                state.loadingSortingPaging = false;
                state.assignments = action.payload.assignments;
                state.page = action.payload.page;
                state.total = action.payload.totalItem;
                state.lastPage = action.payload.lastPage;
            })
            .addCase(declineAssignment.rejected, (state, action) => {
                state.loadingSortingPaging = true;
                state.assignments = [];
                state.page = 0;
                state.total = 0;
                state.lastPage = 0;
            })
            .addCase(returnAssignment.pending, (state, action) => {
                state.loadingSortingPaging = true;
            })
            .addCase(returnAssignment.fulfilled, (state, action) => {
                state.loadingSortingPaging = false;
                state.assignments = action.payload.assignments;
            })
            .addCase(returnAssignment.rejected, (state, action) => {
                state.loadingSortingPaging = true;
                state.assignments = [];
            })
    }
})

const { reducer } = home;
export default reducer;

export const fetchAssignments = createAsyncThunk('assignments/fetchAssignments', async (params) => {
    const res = await assignmentApi.getAll(params);
    return res;
})
export const fetchAssignmentsSortingPaging = createAsyncThunk('assignments/fetchAssignmentsSortingPaging', async (params) => {
    const res = await assignmentApi.getAll(params);
    return res;
})
export const fetchAssignmentDetail = createAsyncThunk('assignment/fetchAssignmentDetail', async (id) => {
    const res = await assignmentApi.getAssignmentDetail(id);
    return res;
})
export const acceptAssignment = createAsyncThunk('assignments/acceptAssignment', async ({ id, pageSize, currentPage, fieldName, softType }) => {
    await assignmentApi.AcceptAssignment(id);
    const params = {
        fieldName: fieldName,
        sortType: softType,
        page: currentPage,
        limit: pageSize,
    };
    const res = await assignmentApi.getAll(params);
    return res;
})
export const declineAssignment = createAsyncThunk('assignments/declineAssignment', async ({ id, pageSize }) => {
    await assignmentApi.DeclineAssignment(id);
    const params = {
        feildName: null,
        sortType: null,
        page: 1,
        limit: pageSize,
    };
    const res = await assignmentApi.getAll(params);
    return res;
})
export const returnAssignment = createAsyncThunk('returningRequests/createRequest', async ({ id, pageSize, currentPage, fieldName, softType }) => {
    await assignmentApi.ReturnAssignment(id);
    const params = {
        fieldName: fieldName,
        sortType: softType,
        page: currentPage,
        limit: pageSize,
    };
    const res = await assignmentApi.getAll(params);
    return res;
})