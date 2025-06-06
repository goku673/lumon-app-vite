import { createSlice } from "@reduxjs/toolkit";

const olympicSlice = createSlice({
  name: "olympic",
  initialState: {
    selectedOlympic: null,
  },
  reducers: {
    setSelectedOlympic: (state, action) => {
      state.selectedOlympic = action.payload;
    },
    clearSelectedOlympic: (state) => {
      state.selectedOlympic = null;
    },
  },
});

export const { setSelectedOlympic, 
               clearSelectedOlympic, } = olympicSlice.actions;
export default olympicSlice.reducer;
