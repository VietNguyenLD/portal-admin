import { PayloadAction } from '@reduxjs/toolkit';
import authApi from 'api/authApi';
import { AuthData, AuthRequest } from 'models/auth';
import { AxiosResponse } from 'models/common';
import { call, fork, put, take } from 'redux-saga/effects';
import { authActions } from './authSlice';

function* handleLogin(payload: AuthRequest) {
  try {
    const response: AxiosResponse<AuthData> = yield call(authApi.login, payload);
    const { status, data } = response;
    if (status === 201) {
      localStorage.setItem('access_token', data.data.accessToken);
      localStorage.setItem('refresh_token', data.data.refreshToken);
      yield put(authActions.loginSuccess(data.data.user));
    }
  } catch (error: any) {
    yield put(authActions.loginFailed(error.response.data));
    console.log(error.message);
  }
}

function* handleLogout() {
  localStorage.clear();
  yield put(authActions.logout());
}

function* watchLoginFlow() {
  while (true) {
    const accessToken = Boolean(localStorage.getItem('access_token'));

    if (!accessToken) {
      const action: PayloadAction<AuthRequest> = yield take(authActions.login.type);
      yield call(handleLogin, action.payload);
    } else {
      yield take(authActions.logout.type);
      yield call(handleLogout);
    }
  }
}

export function* authSaga() {
  yield fork(watchLoginFlow);
}
