import { configureStore } from "@reduxjs/toolkit";
import logSliceReducer from "../slices/logSlice";
import usersLoadSliceReducer from "../slices/admin/usersLoadSlice";
import userSettingSliceReducer from "../slices/userSettingSlice";
import chatListSliceReducer from "../slices/chatListSlice";

const store = configureStore({
    reducer: {
        // User
        logUser: logSliceReducer,
        settings: userSettingSliceReducer,
        chatList: chatListSliceReducer,
        
        // Admin
        users: usersLoadSliceReducer,
        
    }
})

export default store