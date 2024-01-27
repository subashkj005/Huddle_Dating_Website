import { configureStore } from "@reduxjs/toolkit";
import logSliceReducer from "../slices/logSlice";
import usersLoadSliceReducer from "../slices/admin/usersLoadSlice";
import userSettingSliceReducer from "../slices/userSettingSlice";


const store = configureStore({
    reducer: {
        // User
        logUser: logSliceReducer,
        settings: userSettingSliceReducer,
        
        // Admin
        users: usersLoadSliceReducer,
        
    }
})

export default store