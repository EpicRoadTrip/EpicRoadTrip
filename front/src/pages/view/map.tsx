import { useLoadScript, GoogleMap, MarkerF } from '@react-google-maps/api';
import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import CardRow from '@components/CardRow';
import { useAppSelector } from 'src/store/hook';
import styles from '@styledPageStyle/Map.module.css'

const libraries: ("places" | "drawing" | "geometry" | "localContext" | "visualization")[] = ['places']

const MapView: NextPage = () => {
    const [located, setLocated] = useState<boolean>(false);
    const [position, setPosition] = useState<google.maps.LatLng>(new google.maps.LatLng(0, 0));
    const apiStore = useAppSelector(state => state.api)
    const mapOptions = useMemo<google.maps.MapOptions>(() => ({
      disableDefaultUI: false,
      clickableIcons: false,
      scrollwheel: false,

    }), []);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY as string,
        libraries: libraries
    });

    navigator.geolocation.getCurrentPosition((pos) => {
        setPosition(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
        setLocated(true);
    })

    if (!isLoaded || !located)
        return <p>Loading...</p>;

    return (
        <div className={styles.mContainer}>
            <div className={styles.mListOfCardContainer}>
                {
                    apiStore.data.map((item) => (
                        <div key={item.id} className={styles.lItem}>
                            {
                                item.id !== 'Transports' && item.data.length && (
                                    <>
                                        <h3 className={styles.lTitleItem}>{item.id}</h3>
                                        <div className={styles.lItemContainer}>
                                            {
                                                item.data && item.data.length && item.data.map((value) => (
                                                    <div key={value.place_id}>
                                                        <CardRow id={value.place_id} title={value.name} description={value.description} imgSrc={value.photo} price={value.price_level ?? ""}  />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </>
                                )
                            }
                        </div>
                    ))
                }
            </div>
            <div>
                <GoogleMap
                    options={mapOptions}
                    zoom={15}
                    center={position}
                    mapTypeId={google.maps.MapTypeId.ROADMAP}
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    onLoad={() => console.log('Map Component Loaded...')}
                >
                    <MarkerF position={position}/>
                </GoogleMap>
            </div>
        </div>
    );//47.214642, -1.577739
};

export default MapView;
