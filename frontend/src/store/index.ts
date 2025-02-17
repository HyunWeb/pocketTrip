import { configureStore } from "@reduxjs/toolkit";
import currentPageReducer from "../slices/currentPageSlice";
import ModalControlReducer from "../slices/ModalControlSlice";
import AlertControlReducer from "../slices/AlertControlSlice";
import LogoutControlReducer from "../slices/LogoutControlSlice";
import travelReducer from "../slices/travelSlice";
import RoutePathReducer from "../slices/RoutePathSlice";
import editReducer from "../slices/editSlice";
import SaveTourDataReducer from "../slices/SaveTourDataSlice";
import UserDataReducer from "../slices/userDataSlice";
import SpendDataReducer from "../slices/SpendDataSlice";
import webSocketReducer from "../slices/webSocketSlice";

const store = configureStore({
  reducer: {
    currentPage: currentPageReducer,
    modalControl: ModalControlReducer,
    AlertControl: AlertControlReducer,
    LogoutControl: LogoutControlReducer,
    travel: travelReducer,
    prevPath: RoutePathReducer,
    edit: editReducer,
    saveTourData: SaveTourDataReducer,
    userData: UserDataReducer,
    SpendData: SpendDataReducer,
    webSocket: webSocketReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
export type AppDispatch = typeof store.dispatch;
