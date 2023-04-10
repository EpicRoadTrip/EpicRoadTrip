import React from "react"
import { IDetailDataAPI } from "./api"

export interface IMap {
    style?: React.CSSProperties,
    position: IMapItinerary,
    mapOptions?: google.maps.MapOptions
}

export interface IMapItinerary {
    depart: ILatLong,
    dest?: ILatLong,
}

interface ILatLong {
    lat: string,
    long: string,
    data?: IDetailDataAPI
}