import userApi from "api/userAPI";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const user = createSlice({
    name: "user",
    initialState: { loading: false, user: {}, role: "" },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.role = action.payload.type === 1 ? "admin" : "staff";
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.user = {};
            });
    },
});

const { reducer } = user;
export default reducer;

export const fetchUser = createAsyncThunk("users/fetchUser", async () => {
    const res = await userApi.getCurrentUser();
    return res;
});
