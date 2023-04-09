import React from 'react';
import { ICard } from '@interfaces/card';
import styles from './style/CardColumn.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function CardColumn({id, imgSrc, alt, title, price, description}: ICard) {
    return (
        <Link href={`/detail/${encodeURIComponent(id)}`} className={styles.cardContainer} data-testid='card-container'>
            <Image src={imgSrc ? imgSrc : "https://picsum.photos/seed/picsum/200/300"} alt={alt ? alt : "Image of card"} data-testid="card-image" className={styles.cardImage} style={{width: 'auto', height: 120, maxWidth: 350}} width={500} height={500} />
            <div className={styles.cardBody} data-testid='card-body'>
                <div className={styles.cardHeader} data-testid='card-header'>
                    <p className={styles.cardHeaderTitle} data-testid='card-header-title'>{title}</p>
                    <small className={styles.cardHeaderPrice} data-testid='card-header-price'>{ price !== 'Not available' ? price : ""}</small>
                </div>
                <p className={styles.cardBodyDescription} data-testid='card-body-description'>{description}</p>
            </div>
        </Link>
    )
}