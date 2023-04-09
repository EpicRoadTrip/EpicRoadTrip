import React from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/hook';
import { getAccomodation$ } from 'src/store/slices/apiCallSlice';
import styles from '@styledPageStyle/List.module.css';
import { IDetailAPI } from '@interfaces/api';
import CardColumn from '@components/CardColumn';;

export default function ListView() {
    const dispatch = useAppDispatch()
    const apiStore = useAppSelector(state => state.api)
    const searchStore = useAppSelector(state => state.search)
    const [data, setData] = React.useState<IDetailAPI[]>([])
    const [isDataLoaded, setIsDataLoaded] = React.useState(false)
    const [isRequestLaunched, setIsRequestLaunched] = React.useState(false)
    
    React.useEffect(() => {
        if (apiStore.data.length === 0 && !isDataLoaded) {
            const cityName = searchStore.searchValue && searchStore.searchValue.trim() !== '' ? searchStore.searchValue : "paris"; // Get event of the previously saved city that the user wrote or from paris
            if (!isRequestLaunched) {
                setIsRequestLaunched(true)
                dispatch(getAccomodation$(cityName)).unwrap().then((data) => {
                    setIsDataLoaded(true)
                    setData(data.results);
                });
            }
        }
    }, [apiStore.data.length, dispatch, isDataLoaded, searchStore.searchValue, isRequestLaunched]);
    
    return (
        <div className={styles.lContainer}>
            {
                data.map((item) => (
                    <div key={item.place_id}>
                        <CardColumn id={item.place_id} title={item.name} description={item.description} imgSrc={item.photo} price={item.price_level}  />
                    </div>
                ))
            }
        </div>
    )
}