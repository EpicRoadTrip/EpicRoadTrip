import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface ViewState {
    value: boolean
  }
  
const initialState: ViewState = {
    value: true,
}

export const viewSlice = createSlice({
    name: 'view',
    initialState,
    reducers: {
      change: (state) => {
        state.value = !state.value;
      },
    },  
})

export const { change } = viewSlice.actions
export const selectView = (state: any) => state.view.value
export default viewSlice.reducer