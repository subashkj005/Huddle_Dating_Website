import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  matches: [],
};

const chatListSlice = createSlice({
  name: "chatList",
  initialState,
  reducers: {
    addMatches: (state, action) => {
      state.matches = action.payload;
    },
    removeMatches: (state, action) => {
      state.matches = [];
    },
  },
});

export const selectMatchById = (state, chatName) =>
  state.chatList.matches.find((match) => match.chatroom_name === chatName);

export const { addMatches, removeMatches } = chatListSlice.actions;
export default chatListSlice.reducer;
