import type { NextPage } from 'next';
import { useMemo, useState } from 'react';
import CardRow from '@components/CardRow';
import { useAppSelector } from 'src/store/hook';
import styles from '@styledPageStyle/Map.module.css'
import MapEvent from '@components/MapEvent';
import { ILatLong, IMapEvents } from '@interfaces/map';


const MapView: NextPage = () => {
    const apiStore = useAppSelector(state => state.api)
    const mapOptions = useMemo<google.maps.MapOptions>(() => ({
      disableDefaultUI: false,
      clickableIcons: false,
      scrollwheel: false,
      zoom: 0
    }), []);
    const [mapEventData, setMapEventData] = useState<IMapEvents>({
        events: [],
        mapOptions: mapOptions
    })

    useMemo(() => {
        if (apiStore.data.length) {
            const events: ILatLong[] = [];
            apiStore.data.forEach((item) => {
                if (item.id !== 'Transports' && item.data.length) {
                    item.data.forEach((data) => {
                        const location = data.location ? data.location?.split(',').map((str) => str.trim()) : 'Location not available'
                        if (location !== 'Location not available') {
                            events.push({
                                id: crypto.randomUUID(),
                                lat: location[0],
                                long: location[1],
                                data: {
                                    place_id: data.place_id,
                                    formatted_address: data.formatted_address,
                                    description: data.description,
                                    phone: "Not available",
                                    website: "Not available",
                                    photo: data.photo,
                                    hours: [{
                                        id: crypto.randomUUID(),
                                        value: "Not available"
                                    }],
                                    opening_hours: ["Not available"],
                                    name: data.name,
                                    location: data.location as string,
                                }
                            });
                        }
                    });
                }
            });
            mapEventData.events = events;
            setMapEventData(mapEventData);
        }
    }, [apiStore.data, mapEventData])

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
                <MapEvent events={mapEventData.events} mapOptions={mapEventData.mapOptions}/>
            </div>
        </div>
    );
};

export default MapView;
