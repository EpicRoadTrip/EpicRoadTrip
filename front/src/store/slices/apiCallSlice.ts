import { IAPI } from '@interfaces/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const urlAccomodationAPI = process.env.NEXT_PUBLIC_API_ACCOMODATION
const urlBarAPI = process.env.NEXT_PUBLIC_API_BAR
const urlTransportAPI = process.env.NEXT_PUBLIC_API_TRANSPORT
const urlRestaurantAPI = process.env.NEXT_PUBLIC_API_RESTAURANT
const urlEventAPI = process.env.NEXT_PUBLIC_API_EVENT

// Define the initial state using that type
const initialState: IAPI = {
  data: [],
  loading: []
}

export const getAccomodation$ = createAsyncThunk('api/accomodation', async (city_name: string) => {
    console.log(urlAccomodationAPI as string + city_name);
  const { data } = await axios.get(urlAccomodationAPI as string + city_name)
  return data
})

export const getBar$ = createAsyncThunk('api/bar', async (city_name: string) => {
  const { data } = await axios.get(urlBarAPI + city_name)
  return data
})

export const getTransport$ = createAsyncThunk(
  'api/transport',
  async (localization: { locationDest: string; locationStart: string }) => {
    const response = await fetch(urlTransportAPI ?? '', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(localization),
    })
    const data = await response.json()
    return data
  }
)

export const getRestaurant$ = createAsyncThunk('api/restaurant', async (city_name: string) => {
  const { data } = await axios.get(urlRestaurantAPI + city_name)
  return data
})

export const getEvent$ = createAsyncThunk('api/event', async (city_name: string) => {
  const { data } = await axios.get(urlEventAPI + city_name)
  return data
})

export const apiCallSlice = createSlice({
  name: 'apiCall',
  initialState,
  reducers: {},
  extraReducers(builder) {
      builder
        //#region Accomodation
        .addCase(getAccomodation$.pending, (state) => {
            state.loading.push({name: "api/accomodation", isLoading: true});
        })
        .addCase(getAccomodation$.fulfilled, (state, action) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/accomodation');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
            state.data = [...state.data, action.payload]
        })
        .addCase(getAccomodation$.rejected, (state) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/accomodation');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
        })
        //#endregion
        //#region Bar
        .addCase(getBar$.pending, (state) => {
            state.loading.push({name: "api/bar", isLoading: true});
        })
        .addCase(getBar$.fulfilled, (state, action) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/bar');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
            state.data = [...state.data, action.payload]
        })
        .addCase(getBar$.rejected, (state) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/bar');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
        })
        //#endregion
        //#region Transport
        .addCase(getTransport$.pending, (state) => {
            state.loading.push({name: "api/transport", isLoading: true});
        })
        .addCase(getTransport$.fulfilled, (state, action) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/transport');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
            state.data = [...state.data, action.payload]
        })
        .addCase(getTransport$.rejected, (state) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/transport');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
        })
        //#endregion
        //#region Restaurant
        .addCase(getRestaurant$.pending, (state) => {
            state.loading.push({name: "api/restaurant", isLoading: true});
        })
        .addCase(getRestaurant$.fulfilled, (state, action) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/restaurant');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
            state.data = [...state.data, action.payload]
        })
        .addCase(getRestaurant$.rejected, (state) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/restaurant');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
        })
        //#endregion
        //#region Event
        .addCase(getEvent$.pending, (state) => {
            state.loading.push({name: "api/event", isLoading: true});
        })
        .addCase(getEvent$.fulfilled, (state, action) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/event');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
            state.data = [...state.data, action.payload]
        })
        .addCase(getEvent$.rejected, (state) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/event');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
        })
        //#endregion
        
  },
})

export default apiCallSlice.reducer
