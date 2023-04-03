import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import CardColumn from '@components/CardColumn';

const MapView: NextPage = () => {
    const [located, setLocated] = useState<boolean>(false);
    const [position, setPosition] = useState<google.maps.LatLng>(new google.maps.LatLng(0, 0));

    const mapOptions = useMemo<google.maps.MapOptions>(() => ({
      disableDefaultUI: false,
      clickableIcons: false,
      scrollwheel: false,

    }), []);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY as string,
        libraries: ['places']
    });

    navigator.geolocation.getCurrentPosition((pos) => {
        setPosition(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        setLocated(true);
    })

    if (!isLoaded || !located)
        return <p>Loading...</p>;

    return (
        <div style={{display: 'flex', flexDirection: 'row', width: '100%', height: '100%'}}>
            <div style={{overflowY: 'scroll', height: (window.innerHeight/100)*90, width: (window.innerWidth/100)*14, scrollbarColor: 'red'}}>
                <CardColumn title='Event' price='120€' description='Bar à pute'/>
                <CardColumn title='Event' price='120€' description='Bar à pute'/>
                <CardColumn title='Event' price='120€' description='Bar à pute'/>
                <CardColumn title='Event' price='120€' description='Bar à pute'/>
                <CardColumn title='Event' price='120€' description='Bar à pute'/>
                <CardColumn title='Event' price='120€' description='Bar à pute'/>
                <CardColumn title='Event' price='120€' description='Bar à pute'/>
                <CardColumn title='Event' price='120€' description='Bar à pute'/>
                <CardColumn title='Event' price='120€' description='Bar à pute'/>
            </div>
            <div>
                <GoogleMap
                    options={mapOptions}
                    zoom={15}
                    center={position}
                    mapTypeId={google.maps.MapTypeId.ROADMAP}
                    mapContainerStyle={{ width: (window.innerWidth/100)*86, height: (window.innerHeight/100)*90 }}
                    onLoad={() => console.log('Map Component Loaded...')}
                >
                    <MarkerF position={position}/>
                </GoogleMap>
            </div>
        </div>
    );//47.214642, -1.577739
};

export default MapView;