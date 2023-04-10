import React from "react"

export interface IMap {
    style: React.CSSProperties,
    lat: string
    long: string
    mapOptions?: google.maps.MapOptions
}