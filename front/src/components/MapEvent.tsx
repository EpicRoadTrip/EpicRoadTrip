import React from "react";
import { ILatLong, IMapEvents } from "@interfaces/map";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";

const MapEvent = ({ events, mapOptions }: IMapEvents) => {

    const [activeMarker, setActiveMarker] = React.useState<ILatLong | null>(null);

    const handleActiveMarker = (marker: ILatLong) => {
        if (marker === activeMarker) {
        return;
        }
        setActiveMarker(marker);
    };

    const markers = events;

    const handleOnLoad = (map: google.maps.Map) => {
        const bounds = new google.maps.LatLngBounds();
        markers.forEach(({lat, long}) => bounds.extend({ lat: Number.parseFloat(lat), lng: Number.parseFloat(long) }));
        map.fitBounds(bounds);
    };

    return (
        <GoogleMap
            options={mapOptions}
            zoom={7}
            onClick={() => setActiveMarker(null)}
            mapTypeId={google.maps.MapTypeId.ROADMAP}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            onLoad={(position) => handleOnLoad(position)}
        >
            {
                markers.map(({ id, lat, long, data }) => (
                    <Marker
                        key={id}
                        position={{lat: Number.parseFloat(lat), lng: Number.parseFloat(long)}}
                        onClick={() => handleActiveMarker({id, lat, long, data})}
                        >
                        {
                            activeMarker?.id === id ? (
                                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0.5em 1em', fontFamily: 'Montserrat'}}>
                                        <h2 style={{fontWeight: 'bold', fontSize: 14}}>{data?.name}</h2>
                                        <p style={{whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '100%', overflow: 'hidden'}}>{data?.description}</p>
                                    </div>
                                </InfoWindow>
                            ) : null
                        }
                    </Marker>
                ))
            }
        </GoogleMap>
    );
};

export default MapEvent;
