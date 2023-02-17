const { createSlice } = require("@reduxjs/toolkit");

const init = {
    isShowModal: false,
    title: "",
    content: "",
    isShowButtonCloseIcon: false,
    isShowButtonFunction: false,
    isShowButtonClose: false,
    contentButtonFunction: "", 
    contentButtonClose: "", 
    handleFunction: ""
}

const modal = createSlice({
    name: "modal",
    initialState: init,
    reducers: {
        openModal: (state, action) => {
            const {
                title,
                content,
                isShowButtonCloseIcon,
                isShowButtonFunction,
                isShowButtonClose,
                contentButtonFunction, 
                contentButtonClose, 
                handleFunction 
            } = action.payload;

            state.isShowModal = true;
            state.title = title;
            state.content = content;
            state.isShowButtonCloseIcon = isShowButtonCloseIcon;
            state.isShowButtonFunction = isShowButtonFunction;
            state.isShowButtonClose = isShowButtonClose;
            state.contentButtonFunction = contentButtonFunction;
            state.contentButtonClose = contentButtonClose;
            state.handleFunction = handleFunction;
        },
        closeModal: (state, action) => {
            state.isShowModal = false
        }
    },
})

const { reducer, actions } = modal;
export const { openModal, closeModal } = actions;
export default reducer;