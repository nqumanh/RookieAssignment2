import { configureStore } from '@reduxjs/toolkit';
import homeReducer from '../pages/Home/HomeSlice'
import assetReducer from 'pages/ManageAsset/AssetSlice'
import reportReducer from 'pages/Report/ReportSlice'
import userLoginReducer from '../pages/UserSlice'
import modalReducer from '../components/ModalConfirm/ModalConfirmSlice'

const rootReducer = {
	home: homeReducer,
	asset:assetReducer,
    userLogin: userLoginReducer,
    report: reportReducer,
    modal: modalReducer
}

const store = configureStore({
	reducer: rootReducer,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;