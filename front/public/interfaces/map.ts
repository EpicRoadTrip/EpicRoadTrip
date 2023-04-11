import React from "react"
import { IDetailDataAPI } from "./api"

export interface IMap {
    style?: React.CSSProperties,
    position: IMapItinerary,
    mapOptions?: google.maps.MapOptions
}

export interface IMapEvents {
    events: ILatLong[],
    mapOptions?: google.maps.MapOptions
}

export interface IMapItinerary {
    depart: ILatLong,
    dest?: ILatLong,
}

export interface ILatLong {
    id: string,
    lat: string,
    long: string,
    data?: IDetailDataAPI
}