import { ActionText, Feature } from 'constants/permission';
import useCan from 'hooks/useCan';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import RequestCheckInfoDetailPage from './pages/RequestCheckInfoDetailPage';
import RequestCheckInfoPage from './pages/RequestCheckInfoPage';
import ResetSubscriberDetail from './pages/ResetSubscriberDetail';
import './Subscriber.scss';

function SubscriberFeature() {
  const { isCan } = useCan();
  const math = useRouteMatch();

  return (
    <Switch>
      {isCan(Feature.RESET_BATCH_DETAIL, ActionText.READ) && (
        <Route path={`${math.url}/reset-subscriber/detail/:id`} component={ResetSubscriberDetail} />
      )}

      {isCan(Feature.TICKET_REQUEST_BATCH, ActionText.READ) && (
        <Route path={`${math.url}/request-check-info/list`} component={RequestCheckInfoPage} />
      )}

      {isCan(Feature.TICKET_REQUEST_BATCH_DETAIL, ActionText.READ) && (
        <Route
          path={`${math.url}/request-check-info/detail/:id`}
          component={RequestCheckInfoDetailPage}
        />
      )}

      <Redirect to='/admin/dashboard' />
    </Switch>
  );
}

export default SubscriberFeature;
