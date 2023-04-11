export interface IAPI {
    data: IDataAPI[],
    loading: loadingDetail[],
    detail: IDetailDataAPI | null
    idDetail: string
}

export interface IDataAPI {
    id: string,
    data: IDetailAPI[]
}

export interface IDetailDataAPI {
    place_id: string,
    name: string,
    formatted_address: string,
    description: string,
    phone: string,
    location: string,
    hours: {
        id: string,
        value: string,
    }[],
    opening_hours: string[],
    website: string,
    photo: string
}

export interface IDetailAPI {
    place_id: string,
    name: string,
    formatted_address: string,
    photo: string,
    location?: string,
    price_level?: string,
    description: string,
    date?: string,
}

export interface IDataEventAPI {
    name: string,
    formatted_address: string,
    photo: string,
    description: string,
    date: string
}

interface loadingDetail {
    name: string,
    isLoading: boolean
}