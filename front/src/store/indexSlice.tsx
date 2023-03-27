import { createSlice } from '@reduxjs/toolkit';
import { AppState } from './store';
import { HYDRATE } from 'next-redux-wrapper';

export interface IndexState {
    indexState: string;
}

const initialState: IndexState = {
    indexState: 'list'
};

export const indexSlice = createSlice({
    name: 'view',
    initialState,
    reducers: {
        setIndexState(state, action) {
            state.indexState = action.payload;
        },
    },
    extraReducers: {
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload.index,
            };
        },
    }
});

export const { setIndexState } = indexSlice.actions;
export const selectIndexState = (state: AppState) => state.index.indexState;
export default indexSlice.reducer;