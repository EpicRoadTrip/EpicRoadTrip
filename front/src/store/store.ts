import { configureStore } from '@reduxjs/toolkit'
import { viewSlice } from './slices/viewSlice';

export const store = configureStore({
  reducer: {
    view: viewSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch