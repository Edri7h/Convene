import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userDetails:{},
  events: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    clearUser: (state) => {
      state.profile = null;
      state.events = [];
    },
    setEvents: (state, action) => {
      state.events = action.payload;
    },
  },
});

export const { setUserDetails, setEvents } = userSlice.actions;
export default userSlice.reducer;
