import storage from './storage';
import { configureStore } from '@reduxjs/toolkit'
import dateSearchSlice from './slices/dateSearchSlice';
import { viewSlice } from './slices/viewSlice';
import { persistReducer, persistStore } from 'redux-persist';
import searchSlice from './slices/searchSlice';
import apiCallSlice from './slices/apiCallSlice';
import eventPrintSlice from './slices/eventPrintSlice';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedDateSearchReducer = persistReducer(persistConfig, dateSearchSlice);
const persistedSearchReducer = persistReducer(persistConfig, searchSlice);

export const store = configureStore({
  reducer: {
    view: viewSlice.reducer,
    dateSearch: persistedDateSearchReducer,
    search: persistedSearchReducer,
    api: apiCallSlice,
    dataToPrint: eventPrintSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
})

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch