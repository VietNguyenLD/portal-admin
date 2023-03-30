import { PrivateRoute } from 'components/common';
import { AdminLayout } from 'components/layout';
import AuthFeature from 'features/auth';
import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import './App.scss';

function App() {
  return (
    <React.Fragment>
      <Switch>
        <PrivateRoute path='/admin' component={AdminLayout} />

        <Route path='/auth' component={AuthFeature} />

        <Redirect from='/' to='/admin' />
      </Switch>
      <ToastContainer hideProgressBar={true} autoClose={1000} />
    </React.Fragment>
  );
}

export default App;
