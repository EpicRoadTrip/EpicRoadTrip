import { createSlice } from '@reduxjs/toolkit'

interface ViewState {
    value: 'list' | 'map',
    isInPageDetail: boolean
  }
  
const initialState: ViewState = {
    value: 'list',
    isInPageDetail: false,
}

export const viewSlice = createSlice({
    name: 'view',
    initialState,
    reducers: {
      leavePageDetail: (state) => {
        state.isInPageDetail = false
      },
      setIsInPageDetail: (state) => {
        state.isInPageDetail = true
      },
      setListView: (state) => {
        state.value = 'list'
      },
      setMapView: (state) => {
        state.value = 'map'
      },
      change: (state) => {
        if (state.value === 'list') {
          state.value = 'map'
        } else {
          state.value = 'list'
        }
      },
    },  
})

export const { change, setListView, setMapView, setIsInPageDetail, leavePageDetail } = viewSlice.actions
export const selectView = (state: ViewState) => state.value
export default viewSlice.reducer