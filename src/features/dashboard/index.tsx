import { ActionText, Feature } from 'constants/permission';
import useCan from 'hooks/useCan';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import Dashboard from './pages/DashBoard';

function DashBoard() {
  const math = useRouteMatch();
  const { isCan } = useCan();

  if (!isCan(Feature.DASHBOARD_TICKET, ActionText.READ)) return null;

  return (
    <Switch>
      <Route path={`${math.url}/update-subscriber-info`} component={Dashboard} />

      <Redirect from={`${math.url}`} to={`${math.url}/update-subscriber-info`} />
    </Switch>
  );
}

export default DashBoard;
