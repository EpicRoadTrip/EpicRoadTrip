import { IDateSearchSliceState } from '@interfaces/date';
import { ISelectedInputDropdownData } from '@interfaces/input-select-dropdown';
import { INumberSelectorData } from '@interfaces/number-selector';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
interface ISearchSliceState {
  date: IDateSearchSliceState,
  travelers: INumberSelectorData[]
  selectedTypes: ISelectedInputDropdownData[],
  searchValue?: string
};

// Define the initial state using that type
const initialState: ISearchSliceState = {
  date: {
    start: null,
    end: null,
    isDateSet: false
  },
  travelers: [],
  selectedTypes: [],
  searchValue: "",
}

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    saveSearch: (state, action: PayloadAction<ISearchSliceState>) => {
      state.date = action.payload.date;
      state.searchValue = action.payload.searchValue;
      state.selectedTypes = action.payload.selectedTypes;
      state.travelers = action.payload.travelers;
    },
  },
})


export const { saveSearch } = searchSlice.actions;
export default searchSlice.reducer;