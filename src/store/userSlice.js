import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AuthService from "../services/auth.service";
import { showErrorToast, showSuccessToast } from "./toastSlice";
import UserService from "../services/user.service";
import { setUserCookies, clearUserCookies } from "../utils";
import Cookie from "js-cookie";
import socket from "../socket";

const authService = new AuthService(`${import.meta.env.VITE_BASE_URL}/api/v1`);
const userService = new UserService(`${import.meta.env.VITE_BASE_URL}/api/v1`);

export const signUp = createAsyncThunk(
  "user/sign-up",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const userData = await authService.signUp(payload);
      dispatch(showSuccessToast(userData.message));
      return userData;
    } catch (err) {
      dispatch(showErrorToast(err.message));
      return rejectWithValue(err.message);
    }
  }
);

export const signIn = createAsyncThunk(
  "/user/sign-in",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const userData = await authService.signIn(payload?.userData);
      dispatch(showSuccessToast(userData.message));
      return {
        rememberMe: payload.isRememberMe,
        user: userData,
      };
    } catch (err) {
      dispatch(showErrorToast(err.message));
      return rejectWithValue(err.message);
    }
  }
);

export const signOut = createAsyncThunk(
  "/user/sign-out",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const tokens = getState().user.userToken;
      const uid = getState().user.currentUser.id;
      const response = await authService.logOut(uid, tokens);
      dispatch(showSuccessToast("Log out successfully!"));
      dispatch(logout());
      return response;
    } catch (err) {
      dispatch(showErrorToast("Can't log out due to some error"));
      return rejectWithValue(err.message);
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "users/avatar",
  async (payload, { rejectWithValue, dispatch, getState }) => {
    try {
      const tokens = getState().user.userToken;
      const uid = getState().user.currentUser.id;

      const response = await userService.updateAvatar(payload, uid, tokens);

      return response;
    } catch (err) {
      console.log(err);
      dispatch(showErrorToast("Can't change your avatar"));
      return rejectWithValue(err);
    }
  }
);

export const updateBackground = createAsyncThunk(
  "users/background",
  async (payload, { rejectWithValue, dispatch, getState }) => {
    try {
      const tokens = getState().user.userToken;
      const uid = getState().user.currentUser.id;

      const response = await userService.updateBackground(payload, uid, tokens);

      return response;
    } catch (err) {
      dispatch(showErrorToast("Can't change your background"));

      return rejectWithValue(err);
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/update",
  async (payload, { rejectWithValue, dispatch, getState }) => {
    try {
      const tokens = getState().user.userToken;
      const uid = getState().user.currentUser.id;

      const response = await userService.updateMe(payload, uid, tokens);
      dispatch(showSuccessToast("Successfully updated your information"));
      return response;
    } catch (err) {
      dispatch(showErrorToast(err.message));

      return rejectWithValue(err);
    }
  }
);

export const refreshToken = createAsyncThunk(
  "users/refreshToken",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const refreshToken = payload.refreshToken;
      const uid = payload.uid;
      const refreshedData = await authService.refreshToken(uid, refreshToken);

      return refreshedData;
    } catch (err) {
      dispatch(showErrorToast(err.message));

      return rejectWithValue(err);
    }
  }
);

const initState = {
  userToken: null,
  currentUser: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initState,
  reducers: {
    setCurrentUser: (state, { payload }) => {
      state.currentUser = payload;
    },
    logout: (state, payload) => {
      state.currentUser = null;
      state.isLoading = false;
      state.userToken = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(signUp.fulfilled, (state, { payload }) => {
        const tokens = payload?.metadata?.tokens;
        const user = payload?.metadata?.user;

        setUserCookies({ uid: user.id, refreshToken: tokens?.refreshToken });
        socket.connect();
        return {
          ...state,
          isLoading: false,
          currentUser: user,
          userToken: tokens,
        };
      })
      .addCase(signUp.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          currentUser: null,
        };
      });

    builder
      .addCase(signIn.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(signIn.fulfilled, (state, { payload }) => {
        const {
          message,
          metadata: { user, tokens },
        } = payload.user;

        if (payload?.rememberMe) {
          setUserCookies({ uid: user.id, refreshToken: tokens?.refreshToken });
        }
        socket.connect();

        return {
          ...state,
          isLoading: false,
          currentUser: user,
          userToken: tokens,
        };
      })
      .addCase(signIn.rejected, (state, action) => {
        return {
          ...state,
          isLoading: false,
          currentUser: null,
        };
      });

    builder
      .addCase(signOut.pending, (state) => {
        return { ...state, isLoading: true };
      })
      .addCase(signOut.fulfilled, (state, { payload }) => {
        clearUserCookies();
        socket.disconnect();
        return {
          ...state,
          isLoading: false,
          currentUser: null,
        };
      })
      .addCase(signOut.rejected, (state, { payload }) => {
        return {
          ...state,
          isLoading: false,
        };
      });

    builder
      .addCase(updateAvatar.pending, (state, { payload }) => {
        return { ...state, isLoading: true };
      })
      .addCase(updateAvatar.fulfilled, (state, { payload }) => {
        const user = state.currentUser;

        return {
          ...state,
          isLoading: false,
          currentUser: {
            ...user,
            user_avatar: payload?.metadata,
          },
        };
      })
      .addCase(updateAvatar.rejected, (state, { payload }) => {
        return {
          ...state,
          isLoading: false,
        };
      });

    builder
      .addCase(updateBackground.pending, (state, { payload }) => {
        return { ...state, isLoading: true };
      })
      .addCase(updateBackground.fulfilled, (state, { payload }) => {
        const user = state.currentUser;

        return {
          ...state,
          isLoading: false,
          currentUser: {
            ...user,
            user_background: payload?.metadata,
          },
        };
      })
      .addCase(updateBackground.rejected, (state, { payload }) => {
        return {
          ...state,
          isLoading: false,
        };
      });

    builder
      .addCase(updateUser.pending, (state, { payload }) => {
        return { ...state, isLoading: true };
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        return {
          ...state,
          isLoading: false,
          currentUser: payload?.metadata,
        };
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        return {
          ...state,
          isLoading: false,
        };
      });

    builder
      .addCase(refreshToken.pending, (state, { payload }) => {
        return { ...state, isLoading: true };
      })
      .addCase(refreshToken.fulfilled, (state, { payload }) => {
        const tokens = payload?.metadata?.tokens;
        const user = payload?.metadata?.user;

        setUserCookies({ uid: user.id, refreshToken: tokens?.refreshToken });
        socket.connect();
        return {
          ...state,
          isLoading: false,
          currentUser: user,
          userToken: tokens,
        };
      })
      .addCase(refreshToken.rejected, (state, { payload }) => {
        return {
          ...state,
          isLoading: false,
        };
      });
  },
});

export const { setCurrentUser, logout } = userSlice.actions;
export default userSlice.reducer;
