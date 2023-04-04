import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import moment from 'moment';

// Define a type for the slice state
interface DateSearchSliceState {
  start?: Date,
  end?: Date,
  isDateSet: boolean,
};

// Define the initial state using that type
const initialState: DateSearchSliceState = {
  isDateSet: false
}

export const dateSearchSlice = createSlice({
  name: 'dateSearch',
  initialState,
  reducers: {
    addStartDate: (state, action: PayloadAction<Date>) => {
      state.start = action.payload;
    },
    addEndDate: (state, action: PayloadAction<Date>) => {
        if (moment(state.start).isSameOrBefore(action.payload)) {
            state.end = action.payload;
        }
    },
  },
})

export const { addStartDate, addEndDate } = dateSearchSlice.actions;
export default dateSearchSlice.reducer;