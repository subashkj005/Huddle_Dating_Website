import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userSettings : null
};

const userSettingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    storeSettings: (state, action) => {
      state.userSettings = action.payload;
    },
    removeSettings: (state, action) => {
      state.userSettings = null 
    },
  },
});

export const { storeSettings, removeSettings } = userSettingSlice.actions;
export default userSettingSlice.reducer;
