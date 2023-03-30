import { createSlice } from '@reduxjs/toolkit';
import { ChangeSIMType } from 'constants/sim.enum';
import { Filters } from 'models/filters';

export interface FiltersState {
  requestChangeSimFilters: Filters;
  simActivatedFilters: Filters;
  ticketListFilters: Filters;
  ticketPendingFilters: Filters;
  requestListFilters: Filters;
  requestCheckInfoFilter: Filters;
}
const initFilters = {
  page: 1,
  limit: 10,
};

const initialState: FiltersState = {
  requestChangeSimFilters: {
    ...initFilters,
    'filter.type': ChangeSIMType.GET_NEW,
  },
  simActivatedFilters: {
    ...initFilters,
  },
  ticketListFilters: {
    ...initFilters,
    'filter.status': `$in: ${[2, 3, 4, 5, 6, 7]}`, // status: all status, exclude: draft,
  },
  ticketPendingFilters: {
    ...initFilters,
    'filter.status': `$in: ${[3, 4, 5]}`, // status: user_updated, cx_approved, mbf_reject
  },
  requestListFilters: {
    ...initFilters,
    'filter.status': `$in: ${[1]}`, // status: draft
  },
  requestCheckInfoFilter: {
    ...initFilters,
  },
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    requestChangeSim: function (state, action) {
      return {
        ...state,
        requestChangeSimFilters: action.payload,
      };
    },
    simActivated: function (state, action) {
      return {
        ...state,
        simActivatedFilters: action.payload,
      };
    },
    ticketList: (state, action) => {
      return {
        ...state,
        ticketListFilters: action.payload,
      };
    },
    ticketPending: (state, action) => {
      return {
        ...state,
        ticketPendingFilters: action.payload,
      };
    },
    requestList: (state, action) => {
      return {
        ...state,
        requestListFilters: action.payload,
      };
    },
    requestCheckInfoBatchList: (state, action) => {
      return {
        ...state,
        requestCheckInfoFilter: action.payload,
      };
    },
    reset: (state) => {
      return {
        ...state,
        requestChangeSimFilters: initialState.requestChangeSimFilters,
        simActivatedFilters: initialState.simActivatedFilters,
        ticketListFilters: initialState.ticketListFilters,
        ticketPendingFilters: initialState.ticketPendingFilters,
        requestListFilters: initialState.requestListFilters,
        requestCheckInfoFilter: initialState.requestCheckInfoFilter,
      };
    },
  },
});

export const filtersActions = filtersSlice.actions;

const filtersReducer = filtersSlice.reducer;
export default filtersReducer;
