import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    type: "",
    message: "",
  },
  reducers: {
    showSuccessToast: (state, { payload }) => {
      state.type = "success";
      state.message = payload;
    },
    showErrorToast: (state, { payload }) => {
      state.type = "error";
      state.message = payload;
    },
    showWarningToast: (state, { payload }) => {
      state.type = "warning";
      state.message = payload;
    },
    resetToast: (state) => {
      state.type = "";
      state.message = "";
    },
  },
});

export const {
  resetToast,
  showErrorToast,
  showSuccessToast,
  showWarningToast,
} = toastSlice.actions;

export default toastSlice.reducer;
