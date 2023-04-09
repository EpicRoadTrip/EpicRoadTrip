import storage from './storage';
import { configureStore } from '@reduxjs/toolkit'
import dateSearchSlice from './slices/dateSearchSlice';
import { viewSlice } from './slices/viewSlice';
import { persistReducer, persistStore } from 'redux-persist';
import thunk from 'redux-thunk';
import searchSlice from './slices/searchSlice';

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
  },
  middleware: [thunk]
})

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch