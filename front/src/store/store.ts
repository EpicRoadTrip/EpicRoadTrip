import { configureStore } from '@reduxjs/toolkit'
import dateSearchSlice from './slices/dateSearchSlice';
import { viewSlice } from './slices/viewSlice';

export const store = configureStore({
  reducer: {
    view: viewSlice.reducer,
    dateSearch: dateSearchSlice
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch