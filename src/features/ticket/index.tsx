import { ActionText, Feature } from 'constants/permission';
import TicketDetailt from 'features/ticketDetail/pages/ticketDetailt';
import useCan from 'hooks/useCan';
import { Redirect, Route, Switch, useRouteMatch } from 'react-router-dom';
import BatchDetailPage from './pages/BatchDetail';
import ImportTicketList from './pages/ImportTicketList';
import RequestDetail from './pages/RequestDetail';
import RequestListPage from './pages/RequestList';
import SendBatchPage from './pages/SendBatch';
import TicketListPage from './pages/TicketList';
import TicketPendingPage from './pages/TicketPending';
import UpdateSubsBatchDetail from './pages/UpdateSubsBatchDetail';
import './Ticket.scss';

function Ticket() {
  const math = useRouteMatch();
  const { isCan } = useCan();
  return (
    <Switch>
      {isCan(Feature.TICKET_ALL_DETAIL, ActionText.READ) && (
        <Route exact path={`${math.url}/list/:id`} component={TicketDetailt} />
      )}
      {isCan(Feature.TICKET_ALL_LIST, ActionText.READ) && (
        <Route path={`${math.url}/list`} component={TicketListPage} />
      )}
      {isCan(Feature.TICKET_WAITING_LIST_DETAIL, ActionText.READ) && (
        <Route exact path={`${math.url}/pending/:id`} component={TicketDetailt} />
      )}
      {isCan(Feature.TICKET_WAITING_LIST, ActionText.READ) && (
        <Route exact path={`${math.url}/pending`} component={TicketPendingPage} />
      )}
      {isCan(Feature.TICKET_REQUESTED_LIST, ActionText.READ) && (
        <Route exact path={`${math.url}/request-list`} component={RequestListPage} />
      )}
      {isCan(Feature.TICKET_REQUESTED_DETAIL, ActionText.READ) && (
        <Route exact path={`${math.url}/request-detail/:serial`} component={RequestDetail} />
      )}
      {isCan(Feature.TICKET_SENDBATCH, ActionText.READ) && (
        <Route exact path={`${math.url}/send-batch`} component={SendBatchPage} />
      )}
      {isCan(Feature.TICKET_SENDBATCH_DETAIL, ActionText.READ) && (
        <Route path={`${math.url}/send-batch/:id`} component={BatchDetailPage} />
      )}
      {isCan(Feature.TICKET_IMPORTBATCH, ActionText.READ) && (
        <Route exact path={`${math.url}/import-list-cntttb`} component={ImportTicketList} />
      )}
      {isCan(Feature.TICKET_IMPORTBATCH_DETAIL, ActionText.READ) && (
        <Route
          exact
          path={`${math.url}/update-subs-batch-detail/:id`}
          component={UpdateSubsBatchDetail}
        />
      )}

      <Redirect to='/admin/dashboard' />
    </Switch>
  );
}

export default Ticket;
