import { ActionText, Feature } from 'constants/permission';
import useCan from 'hooks/useCan';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import ImportPhoneList from './pages/ImportPhoneList';

function Phone() {
  const math = useRouteMatch();
  const { isCan } = useCan();
  return (
    <Switch>
      {isCan(Feature.RESET_BATCH, ActionText.READ) && (
        <Route path={`${math.url}/list`} component={ImportPhoneList} />
      )}

      <Redirect to='/admin/dashboard' />
    </Switch>
  );
}

export default Phone;
