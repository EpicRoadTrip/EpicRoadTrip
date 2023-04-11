import { IDateSearchSliceState } from '@interfaces/date';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

// Define a type for the slice state

// Define the initial state using that type
const initialState: IDateSearchSliceState = {
  start: null,
  end: null,
  isDateSet: false
}

export const dateSearchSlice = createSlice({
  name: 'dateSearch',
  initialState,
  reducers: {
    addStartDate: (state, action: PayloadAction<string>) => {
      state.start = action.payload;
      if (state.end) {
        state.isDateSet = true;
      }
    },
    addEndDate: (state, action: PayloadAction<string>) => {
      if (moment(state.start).isSameOrBefore(action.payload)) {
        state.end = action.payload;
        if (state.start) {
          state.isDateSet = true;
        }
      }
    },
  },
})

export const { addStartDate, addEndDate } = dateSearchSlice.actions;
export default dateSearchSlice.reducer;