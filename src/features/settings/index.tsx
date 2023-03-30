import { ActionText, Feature } from 'constants/permission';
import useCan from 'hooks/useCan';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import LockCancelService from './pages/LockCancelService';
import Param from './pages/Param';
import SuggestUser from './pages/SuggestUser';
import './Setting.scss';
import RequestReason2 from './pages/RequestReason2';

function Setting() {
  const math = useRouteMatch();
  const { isCan } = useCan();
  return (
    <Switch>
      {isCan(Feature.CONFIG_APP_REASON, ActionText.READ) && (
        <Route path={`${math.url}/lock-cancel-service`} component={LockCancelService} />
      )}

      {isCan(Feature.CONFIG_PARAM, ActionText.READ) && (
        <Route path={`${math.url}/param`} component={Param} />
      )}

      {isCan(Feature.CONFIG_TICKET_REASON, ActionText.READ) && (
        <Route path={`${math.url}/request-reason`} component={RequestReason2} />
      )}

      {isCan(Feature.CONFIG_BROADCAST, ActionText.READ) && (
        <Route path={`${math.url}/suggest-user`} component={SuggestUser} />
      )}

      <Redirect to='/admin/dashboard' />
    </Switch>
  );
}

export default Setting;
