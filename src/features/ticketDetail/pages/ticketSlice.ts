import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDataTable } from 'components/TableSelected';
import { ItemType, ItemTypeText } from 'constants/ticket.enum';
import { Ticket, TicketFilter } from 'models/ticket';

export interface TicketState {
  isOpenModal: boolean;
  ticket: Ticket | null;
  dataItem: IDataTable[];
  dataReason: IDataTable[];
  query: TicketFilter;
  queryPending: TicketFilter;
  queryRequest: TicketFilter;
  queryApproved: TicketFilter;
  simDatail?: any;
}
export const data: IDataTable[] = [
  { text: ItemTypeText.ID_FRONT, checked: false, disabled: true, value: ItemType.ID_FRONT },
  { text: ItemTypeText.ID_BACK, checked: false, disabled: true, value: ItemType.ID_BACK },
  { text: ItemTypeText.PORTRAIT, checked: false, disabled: true, value: ItemType.PORTRAIT },
  { text: ItemTypeText.SIGNATURE, checked: false, disabled: true, value: ItemType.SIGNATURE },
];

const initialState: TicketState = {
  isOpenModal: false,
  ticket: null,
  dataItem: data,
  dataReason: [],
  query: {
    limit: 10,
    page: 1,
    'filter.status': `$in: ${[2, 3, 5, 6, 7]}`,
  },
  queryPending: {
    limit: 10,
    page: 1,
    'filter.status': `$in: ${[3, 5]}`,
  },
  queryRequest: {
    limit: 10,
    page: 1,
    'filter.status': `$eq: 1`,
  },
  queryApproved: {
    limit: 10,
    page: 1,
    'filter.status': `$eq: 4`,
  },
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ isOpen: boolean }>) => {
      state.isOpenModal = action.payload.isOpen;
    },
    ticketDetail: (state, action) => {
      state.ticket = action.payload;
    },
    setItemData: (state, action) => {
      state.dataItem = action.payload;
    },
    setDataReason: (state, action) => {
      state.dataReason = action.payload;
    },
    setQueryFilter: (state, action) => {
      state.query = action.payload;
    },
    setQueryFilterPending: (state, action) => {
      state.queryPending = action.payload;
    },
    setQueryFilterRequest: (state, action) => {
      state.queryRequest = action.payload;
    },
    setQueryFilterApproved: (state, action) => {
      state.queryApproved = action.payload;
    },
    setSimDatail: (state, action) => {
      state.simDatail = action.payload;
    },
  },
});

export const ticketActions = ticketSlice.actions;

const ticketReducer = ticketSlice.reducer;
export default ticketReducer;
