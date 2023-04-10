import React from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/hook';
import { getEvent$ } from 'src/store/slices/apiCallSlice';
import styles from '@styledPageStyle/List.module.css';
import CardColumn from '@components/CardColumn';

export default function ListView() {
    const dispatch = useAppDispatch()
    const apiStore = useAppSelector(state => state.api)
    const searchStore = useAppSelector(state => state.search)
    const [isDataLoaded, setIsDataLoaded] = React.useState(false)
    const [isRequestLaunched, setIsRequestLaunched] = React.useState(false)
    
    React.useEffect(() => {
        if (apiStore.data.length === 0 && !isDataLoaded) {
            const cityName = searchStore.searchValue && searchStore.searchValue.trim() !== '' ? searchStore.searchValue : "paris"; // Get event of the previously saved city that the user wrote or from paris
            if (!isRequestLaunched) {
                setIsRequestLaunched(true)
                dispatch(getEvent$(cityName)).unwrap().then(() => {
                    setIsDataLoaded(true)
                });
            }
        }
    }, [apiStore.data.length, dispatch, isDataLoaded, searchStore.searchValue, isRequestLaunched]);
    
    return (
        <div className={styles.lContainer} data-testid='iv-list'>
            {
                apiStore.data.map((item) => (
                    <div key={item.id} className={styles.lItem}>
                        <h3 className={styles.lTitleItem}>{item.id}</h3>
                        <div className={styles.lItemContainer}>
                            {
                                item.data && item.data.map((value) => (
                                    <div key={value.place_id}>
                                        <CardColumn id={value.place_id} title={value.name} description={value.description} imgSrc={value.photo} price={value.price_level ?? ""}  />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}