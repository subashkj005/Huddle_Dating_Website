import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: null
}

const usersLoadSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    storeUsers: (state, action) => {
      state.users = action.payload
    },
    clearUsers: (state) => {
      state.users = null
    },
  }
})

export const {storeUsers, clearUsers} = usersLoadSlice.actions;
export default usersLoadSlice.reducer;
