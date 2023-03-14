import React from 'react';
import { ICard } from '@/public/interfaces/card';
import styles from './style/CardColumn.module.css';

export default function CardColumn({imgSrc, title, price, description}: ICard) {
    return (
        <div className={styles.cardContainer} data-testid='card-container'>
            <img src={imgSrc}  alt="Image of the card" className={styles.cardImage} data-testid='card-image' />
            <div className={styles.cardBody} data-testid='card-body'>
                <div className={styles.cardHeader} data-testid='card-header'>
                    <p className={styles.cardHeaderTitle} data-testid='card-header-title'>{title}</p>
                    <small className={styles.cardHeaderPrice} data-testid='card-header-price'>{price}</small>
                </div>
                <p className={styles.cardBodyDescription} data-testid='card-body-description'>{description}</p>
            </div>
        </div>
    )
}