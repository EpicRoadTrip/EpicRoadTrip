import { IDetailAPI } from '@interfaces/api'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
  
const initialState: {
    selectedDataToPrint: IDetailAPI[]
} = {
    selectedDataToPrint: [],
}

export const eventPrintSlice = createSlice({
    name: 'view',
    initialState,
    reducers: {
        selectDetail: (state, action: PayloadAction<IDetailAPI>) => {
            const data = state.selectedDataToPrint.find((item) => item.place_id === action.payload.place_id);
            if (!data) {
                state.selectedDataToPrint.push(action.payload)
            }
        },
        deselectDetail: (state, action: PayloadAction<IDetailAPI>) => {
            const data = state.selectedDataToPrint.find((item) => item.place_id === action.payload.place_id);
            if (data) {
                state.selectedDataToPrint = state.selectedDataToPrint.filter(item => item.place_id !== data.place_id)
            }
        },
    },  
})

export const { selectDetail, deselectDetail } = eventPrintSlice.actions
export default eventPrintSlice.reducer