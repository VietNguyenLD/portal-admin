import { ActionText, Feature } from 'constants/permission';
import useCan from 'hooks/useCan';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ChangeSimDetail from './pages/ChangeSimDetail';
import RequestChangeSIMDetail from './pages/RequestChangeSIMDetail';
import RequestChangeSimList from './pages/RequestChangeSimList';
import RequestToChange from './pages/RequestToChange';
import SimActivatedDetail from './pages/SimActivatedDetail';
import SimActivatedListPage from './pages/SimActivatedList';
import './Sim.scss';

function SimFeature() {
  const math = useRouteMatch();
  const { isCan } = useCan();
  return (
    <Switch>
      {isCan(Feature.ACTIVATED_SIM_LIST, ActionText.READ) && (
        <Route path={`${math.url}/activated-list`} component={SimActivatedListPage} />
      )}

      {isCan(Feature.ACTIVATED_SIM_LIST, ActionText.READ) && (
        <Route path={`${math.url}/details/:serial`} component={SimActivatedDetail} />
      )}

      {isCan(Feature.ACTIVATED_SIM_CHANGE_SIM, ActionText.READ) && (
        <Route exact path={`${math.url}/request-to-change`} component={RequestToChange} />
      )}

      {isCan(Feature.ACTIVATED_SIM_CHANGE_SIM_DETAIL, ActionText.READ) && (
        <Route path={`${math.url}/request-to-change/details/:id`} component={ChangeSimDetail} />
      )}

      {isCan(Feature.ACTIVATED_SIM_CHANGE_SIM, ActionText.READ) && (
        <Route path={`${math.url}/request-change-sim/list`} component={RequestChangeSimList} />
      )}

      {isCan(Feature.ACTIVATED_SIM_CHANGE_SIM_DETAIL, ActionText.READ) && (
        <Route
          path={`${math.url}/request-change-sim/detail/:id`}
          component={RequestChangeSIMDetail}
        />
      )}

      <Redirect from={`${math.url}`} to={`${math.url}/activated-list`} />
    </Switch>
  );
}

export default SimFeature;
