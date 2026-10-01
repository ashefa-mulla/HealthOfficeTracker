import { createSlice } from '@reduxjs/toolkit';

export interface LoginState {
  user: any;
  error: string;
  loading: boolean;
  isUserLogout: boolean;
  errorMsg: boolean;
}

export const initialState: LoginState = {
  user: '',
  error: '',
  loading: false,
  isUserLogout: false,
  errorMsg: false,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
      state.error = '';
      state.errorMsg = false;
    },
    loginSuccess(state, action) {
      state.user = action.payload;
      state.loading = false;
      state.errorMsg = false;
      state.error = '';
    },
    apiError(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.isUserLogout = false;
      state.errorMsg = true;
    },
    resetLoginFlag(state) {
      state.error = '';
      state.loading = false;
      state.errorMsg = false;
    },
    logoutUserSuccess(state) {
      state.isUserLogout = true;
      state.loading = false;
      state.error = '';
      state.errorMsg = false;
      state.user = '';
    },
  },
});

export const { setLoading, loginSuccess, apiError, resetLoginFlag, logoutUserSuccess } = loginSlice.actions;
export default loginSlice.reducer;
