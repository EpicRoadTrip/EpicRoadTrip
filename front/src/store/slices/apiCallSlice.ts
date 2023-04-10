import { IDataEventAPI, IDetailAPI } from './../../../public/interfaces/api';
import { IAPI } from '@interfaces/api'
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import * as moment from 'moment-timezone';
import momentLg from 'moment';

type DateResult = {
  startDate: Date;
  endDate?: Date;
};

function parseDateString(dateString: string): DateResult | null {
  const regex = /([A-Za-z]+),\s+([A-Za-z]+)\s+(\d+),\s+(\d+):(\d+)\s+([AP]M)(?:\s+[-–]\s+([A-Za-z]+)?,\s+([A-Za-z]+)?\s+(\d+)?,\s+(\d+)?:(\d+)?\s+([AP]M))?\s+GMT\+(\d+)/;
  const match = dateString.match(regex);

  if (match) {
    const [
      ,
      day1,
      month1,
      date1,
      hour1,
      minute1,
      ampm1,
      day2,
      month2,
      date2,
      hour2,
      minute2,
      ampm2,
      timezoneOffset,
    ] = match;

    const startDate = moment.tz(
      `${day1}, ${month1} ${date1}, ${hour1}:${minute1} ${ampm1}`,
      'ddd, MMM D, h:mm A',
      `Etc/GMT+${timezoneOffset}`
    ).toDate();

    if (day2 && month2 && date2 && hour2 && minute2 && ampm2) {
      const endDate = moment.tz(
        `${day2}, ${month2} ${date2}, ${hour2}:${minute2} ${ampm2}`,
        'ddd, MMM D, h:mm A',
        `Etc/GMT+${timezoneOffset}`
      ).toDate();

      return { startDate, endDate };
    }

    return { startDate };
  }

  return null;
}

const urlAccomodationAPI = process.env.NEXT_PUBLIC_API_ACCOMODATION
const urlBarAPI = process.env.NEXT_PUBLIC_API_BAR
const urlTransportAPI = process.env.NEXT_PUBLIC_API_TRANSPORT
const urlRestaurantAPI = process.env.NEXT_PUBLIC_API_RESTAURANT
const urlEventAPI = process.env.NEXT_PUBLIC_API_EVENT
const urlDetailAPI = process.env.NEXT_PUBLIC_API_DETAIL

// Define the initial state using that type
const initialState: IAPI = {
  data: [],
  loading: [],
  detail: null,
  idDetail: ""
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
        method: 'POST',
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getEvent$ = createAsyncThunk('api/event', async ({city_name, _start, _end}: {city_name: string, _start: string | null, _end: string | null}) => {
  const { data } = await axios.get(urlEventAPI + city_name)
  return {data, _start, _end}
})

export const getDetail$ = createAsyncThunk('api/detail', async (id: string) => {
  const { data } = await axios.get(urlDetailAPI + id)
  return data
})

export const apiCallSlice = createSlice({
  name: 'apiCall',
  initialState,
  reducers: {
    setDetailId: (state, action: PayloadAction<string>) => {
        state.idDetail = action.payload;
    },
    resetSearch: (state) => {
        state.data = [];
        state.loading = [];
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
                data.data.push(action.payload.data.results)
            } else {
                state.data.push({
                    id: "Transports",
                    data: action.payload.data.results
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
                let formattedData = action.payload.data.results.map((data: IDataEventAPI) => {
                    return {
                        place_id: crypto.randomUUID(),
                        name: data.name,
                        formatted_adress: data.formatted_address,
                        photo: data.photo,
                        description: data.description.trim() !== "" ? data.description : "No description available",
                        date: data.date
                    }
                });
                formattedData = formattedData.filter((data: IDataEventAPI) => momentLg(parseDateString(data.date)?.startDate).isBetween(momentLg(action.payload._start), momentLg(action.payload._end)))
                data.data.push(formattedData)
            } else {
                let formattedData: IDetailAPI[] = action.payload.data.results.map((data: IDataEventAPI) => {
                    return {
                        place_id: crypto.randomUUID(),
                        name: data.name,
                        formatted_adress: data.formatted_address,
                        photo: data.photo,
                        description: data.description.trim() !== "" ? data.description : "No description available",
                        date: data.date
                    }
                });
                formattedData = formattedData.filter(data => momentLg(parseDateString(data.date ?? '')?.startDate).isBetween(momentLg(action.payload._start), momentLg(action.payload._end)))
                state.data.push({
                    id: "Events",
                    data: formattedData
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
                    state.detail.place_id = state.idDetail;
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
                    const detailItem = item.data.find((value) => value.place_id === state.idDetail);
                    if (detailItem) {
                        state.detail = {
                            place_id: detailItem.place_id ?? crypto.randomUUID(),
                            description: detailItem.description,
                            formatted_address: detailItem.formatted_address,
                            name: detailItem.name,
                            location: detailItem.location ?? "Not available",
                            photo: detailItem.photo,
                            phone: "Not available",
                            opening_hours: ["Not available"],
                            website: "Not available",
                            hours: [{
                                id: crypto.randomUUID(),
                                value: "Not available"
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
                const detailItem = item.data.find((value) => value.place_id === state.idDetail);
                if (detailItem) {
                    state.detail = {
                        place_id: detailItem.place_id ?? crypto.randomUUID(),
                        description: detailItem.description,
                        formatted_address: detailItem.formatted_address,
                        name: detailItem.name,
                        location: detailItem.location ?? "Not available",
                        photo: detailItem.photo,
                        phone: "Not available",
                        opening_hours: ["Not available"],
                        website: "Not available",
                        hours: [{
                            id: crypto.randomUUID(),
                            value: "Not available"
                        }]
                    }
                }
            })
        })
        //#endregion
        
  },
})

export const { resetSearch, setDetailId } = apiCallSlice.actions
export default apiCallSlice.reducer
