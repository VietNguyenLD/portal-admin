import { Redirect, Route, RouteProps } from 'react-router-dom';

export function PrivateRoute(props: RouteProps) {
  const accessToken = Boolean(localStorage.getItem('access_token'));

  if (!accessToken) {
    return <Redirect to='/auth/login' />;
  }

  return <Route {...props} />;
}
