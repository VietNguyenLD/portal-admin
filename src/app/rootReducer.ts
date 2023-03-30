import authReducer from 'features/auth/authSlice';
import filtersReducer from 'features/filtersSlice';
import simReducer from 'features/sim/simSlice';
import ticketReducer from 'features/ticketDetail/pages/ticketSlice';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  auth: authReducer,
  ticket: ticketReducer,
  sim: simReducer,
  filters: filtersReducer,
});

export default rootReducer;
