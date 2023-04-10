import { IAPI } from '@interfaces/api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const urlAccomodationAPI = process.env.NEXT_PUBLIC_API_ACCOMODATION
const urlBarAPI = process.env.NEXT_PUBLIC_API_BAR
const urlTransportAPI = process.env.NEXT_PUBLIC_API_TRANSPORT
const urlRestaurantAPI = process.env.NEXT_PUBLIC_API_RESTAURANT
const urlEventAPI = process.env.NEXT_PUBLIC_API_EVENT
const urlDetailAPI = process.env.NEXT_PUBLIC_API_DETAIL

let idDetail = "";

// Define the initial state using that type
const initialState: IAPI = {
  data: [],
  loading: [],
  detail: null
}

export const getAccomodation$ = createAsyncThunk('api/accomodation', async (city_name: string) => {
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

export const getDetail$ = createAsyncThunk('api/detail', async (id: string) => {
  const { data } = await axios.get(urlDetailAPI + id)
  idDetail = id;
  return data
})

export const apiCallSlice = createSlice({
  name: 'apiCall',
  initialState,
  reducers: {
    resetSearch: (state) => {
        state.data = [];
    }
  },
  extraReducers(builder) {
      builder
        //#region Accomodation
        .addCase(getAccomodation$.pending, (state) => {
            state.loading.push({name: "api/accomodation", isLoading: true});
        })
        .addCase(getAccomodation$.fulfilled, (state, action) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/accomodation');
            const data = state.data.find((item) => item.id === 'Accomodations');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
            if (data) {
                data.data = action.payload.results
            } else {
                state.data.push({
                    id: "Accomodations",
                    data: action.payload.results
                })
            }
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
            const data = state.data.find((item) => item.id === 'Bars');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
            if (data) {
                data.data.push(action.payload.results)
            } else {
                state.data.push({
                    id: "Bars",
                    data: action.payload.results
                })
            }
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
            const data = state.data.find((item) => item.id === 'Transports');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
            if (data) {
                data.data.push(action.payload.results)
            } else {
                state.data.push({
                    id: "Transports",
                    data: action.payload.results
                })
            }
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
            const data = state.data.find((item) => item.id === 'Restaurants');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
            if (data) {
                data.data.push(action.payload.results)
            } else {
                state.data.push({
                    id: "Restaurants",
                    data: action.payload.results
                })
            }
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
            const data = state.data.find((item) => item.id === 'Events');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
            if (data) {
                data.data.push(action.payload.results)
            } else {
                state.data.push({
                    id: "Events",
                    data: action.payload.results
                })
            }
        })
        .addCase(getEvent$.rejected, (state) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/event');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
        })
        //#endregion
        //#region Detail
        .addCase(getDetail$.pending, (state) => {
            state.loading.push({name: "api/detail", isLoading: true});
        })
        .addCase(getDetail$.fulfilled, (state, action) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/detail');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
            if (action.payload) {
                state.detail = action.payload.results
                if (state.detail) {
                    state.detail.place_id = idDetail;
                    state.detail.hours = [];
                    state.detail.opening_hours.forEach(value => {
                        state.detail?.hours.push({
                            id: crypto.randomUUID(),
                            value: value
                        })
                    })
                }
            } else {
                state.data.forEach((item) => {
                    const detailItem = item.data.find((value) => value.place_id === idDetail);
                    if (detailItem) {
                        state.detail = {
                            place_id: detailItem.place_id,
                            description: detailItem.description,
                            formatted_address: detailItem.formatted_address,
                            name: detailItem.name,
                            location: detailItem.location,
                            photo: detailItem.photo,
                            phone: "Indisponible",
                            opening_hours: ["Indisponible"],
                            website: "Indisponible",
                            hours: [{
                                id: crypto.randomUUID(),
                                value: "Indisponible"
                            }]
                        }
                    }
                })
            }
        })
        .addCase(getDetail$.rejected, (state) => {
            const loading = state.loading.find((loadingState) => loadingState.name === 'api/detail');
            if (loading) {
                state.loading.filter((item) => item.name === loading.name);
            }
            state.data.forEach((item) => {
                const detailItem = item.data.find((value) => value.place_id === idDetail);
                if (detailItem) {
                    state.detail = {
                        place_id: detailItem.place_id,
                        description: detailItem.description,
                        formatted_address: detailItem.formatted_address,
                        name: detailItem.name,
                        location: detailItem.location,
                        photo: detailItem.photo,
                        phone: "Indisponible",
                        opening_hours: ["Indisponible"],
                        website: "Indisponible",
                        hours: [{
                            id: crypto.randomUUID(),
                            value: "Indisponible"
                        }]
                    }
                }
            })
        })
        //#endregion
        
  },
})

export const { resetSearch } = apiCallSlice.actions
export default apiCallSlice.reducer
