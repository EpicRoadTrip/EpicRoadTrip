export interface IAPI {
    data: IDataAPI[],
    loading: loadingDetail[],
}

export interface IDataAPI {
    id: string,
    data: IDetailAPI[]
}

interface IDetailAPI {
    place_id: string,
    name: string,
    formatted_address: string,
    photo: string,
    location: string,
    price_level: string,
    description: string,
}

interface loadingDetail {
    name: string,
    isLoading: boolean
}