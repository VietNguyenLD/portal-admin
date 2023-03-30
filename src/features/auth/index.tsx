import { PrivateRoute } from 'components/common';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ChangePassword from './pages/ChangePassword';
import LoginPage from './pages/LoginPage';
import LogoutPage from './pages/LogoutPage';
import ResetPassword from './pages/ResetPassword';

function AuthFeature() {
  const math = useRouteMatch();
  return (
    <Switch>
      <PrivateRoute path={`${math.url}/change-password`} component={ChangePassword} />

      <Route exact path={`${math.url}/login`} component={LoginPage} />
      <Route exact path={`${math.url}/logout`} component={LogoutPage} />
      <Route exact path={`${math.url}/reset-password/:key`} component={ResetPassword} />

      <Redirect from='/auth' to='/auth/login' />
    </Switch>
  );
}

export default AuthFeature;
