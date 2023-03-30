import { authSaga } from 'features/auth/authSaga';
import { all } from 'redux-saga/effects';

export default function* rootSagas() {
  yield all([authSaga()]);
}
