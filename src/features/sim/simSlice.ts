import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  filters: {
    page: 1,
    limit: 10,
    'filter.sim_status': '',
  },
};

const simSlice = createSlice({
  name: 'sim',
  initialState,
  reducers: {
    filters: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        filters: action.payload,
      };
    },
  },
});
export const simActions = simSlice.actions;

const simReducer = simSlice.reducer;
export default simReducer;
