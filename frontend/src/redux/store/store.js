import { configureStore } from "@reduxjs/toolkit";
import logSliceReducer from "../slices/logSlice";
import usersLoadSliceReducer from "../slices/admin/usersLoadSlice";


const store = configureStore({
    reducer: {
        // User
        logUser: logSliceReducer,
        
        // Admin
        users: usersLoadSliceReducer,
        
    }
})

export default store