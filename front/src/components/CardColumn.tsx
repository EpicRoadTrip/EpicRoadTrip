import React from 'react';
import { ICard } from '@interfaces/card';
import styles from './style/CardColumn.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { ChakraProvider, Checkbox } from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'src/store/hook';
import { IDetailAPI } from '@interfaces/api';
import { deselectDetail, selectDetail } from 'src/store/slices/eventPrintSlice';

export default function CardColumn({ place_id, name, description, price_level, photo, formatted_address }: ICard) {
    const dispatch = useAppDispatch()
    const dataToPrintStore = useAppSelector(state => state.dataToPrint)
    const isItemSelected = (place_id: string) => dataToPrintStore.selectedDataToPrint.find(item => item.place_id === place_id) !== undefined;

    function handleSelectData(data: IDetailAPI) {
        if (isItemSelected(data.place_id)) {
            dispatch(deselectDetail(data))
        } else {
            dispatch(selectDetail(data))
        }
    }

    return (
        <div className={styles.cardWrapper}>
            <div className={styles.cardCheckbox}>
                <ChakraProvider>
                    <Checkbox
                        borderColor='#001845'
                        isChecked={isItemSelected(place_id)}
                        onChange={() => handleSelectData({ place_id, name, description, price_level, photo, formatted_address })}
                    />
                </ChakraProvider>
            </div>
            <Link href={`/detail/${encodeURIComponent(place_id)}`} className={styles.cardContainer} data-testid='card-container'>
                <Image src={photo ? photo : "https://picsum.photos/seed/picsum/200/300"} alt={''} data-testid="card-image" className={styles.cardImage} style={{ width: 'auto', height: 120, maxWidth: 350 }} width={500} height={500} />
                <div className={styles.cardBody} data-testid='card-body'>
                    <div className={styles.cardHeader} data-testid='card-header'>
                        <p className={styles.cardHeaderTitle} data-testid='card-header-title'>{name}</p>
                        <small className={styles.cardHeaderPrice} data-testid='card-header-price'>{price_level !== 'Not available' ? price_level : ""}</small>
                    </div>
                    <p className={styles.cardBodyDescription} data-testid='card-body-description'>{description && description.trim() !== "" ? description : "No description"}</p>
                </div>
            </Link>
        </div>
    )
}