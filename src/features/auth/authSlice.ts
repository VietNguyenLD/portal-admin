import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthRequest, User } from 'models/auth';

export interface AuthState {
  logging: boolean;
  currentUser?: User;
  error?: any;
}

const initialState: AuthState = {
  logging: false,
  currentUser: undefined,
  error: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthRequest>) => {
      return {
        ...state,
        logging: true,
      };
    },

    loginSuccess: (state, action: PayloadAction<User>) => {
      return {
        ...state,
        logging: false,
        currentUser: action.payload,
        error: undefined,
      };
    },

    loginFailed: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        logging: false,
        currentUser: undefined,
        error: action.payload,
      };
    },

    logout: (state) => {
      return {
        ...state,
        logging: false,
        currentUser: undefined,
        error: undefined,
      };
    },
  },
});

export const authActions = authSlice.actions;

const authReducer = authSlice.reducer;
export default authReducer;
