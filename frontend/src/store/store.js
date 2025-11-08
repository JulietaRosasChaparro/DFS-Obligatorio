import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice.js";
import mobileSlice from "../slices/mobileSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    mobile: mobileSlice,
  },
});

export default store;
