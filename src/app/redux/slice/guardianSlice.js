import { createSlice } from "@reduxjs/toolkit";

const guardianSlice = createSlice({
  name: "guardian",
  initialState: {
    guardian: null,
    competitor: null,
  },
  reducers: {
    setGuardian(state, action) {
      state.guardian = action.payload;
    },
    setCompetitor(state, action) {
      state.competitor = action.payload;
    },
    clearGuardian(state) {
      state.guardian = null;
    },
    clearCompetitor(state) {
      state.competitor = null;
    },
  },
});

export const { 
    setGuardian,
    setCompetitor,
    clearGuardian, 
    clearCompetitor } = guardianSlice.actions;
export default guardianSlice.reducer;