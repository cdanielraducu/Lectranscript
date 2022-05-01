import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../App";

export interface ProfileState {
  loggedIn: boolean;
  user?: User;
}

const initialState: ProfileState = {
  loggedIn: false,
  user: undefined,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    login: (state, payload) => {
      state.loggedIn = true;
      state.user = payload.payload.user;
    },
    logout: (state) => {
      state.loggedIn = false;
      state.user = undefined;
    },
  },
});

export const { login, logout } = profileSlice.actions;

export default profileSlice.reducer;
