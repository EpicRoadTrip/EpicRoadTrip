import { INumberSelector } from '@/public/interfaces/number-selector';
import React from 'react';
import styles from './style/NumberSelector.module.css';

export default function NumberSelector({ title, items }: INumberSelector) {
    return (
        <div className={styles.nbsContainer} data-testid='nbs-container'>
            <h2 className={styles.nbsTitle} data-testid='nbs-title'>{title ?? "Veuillez insérer un titre"}</h2>
            <div className={styles.nbsBody}>
                {
                    items.map((item) => (
                        <div key={item.id} className={styles.nbsBodyItem}>
                            <p className={styles.nbsBodyItemName}>{item.name}</p>
                            <div className={styles.nbsBodyItemActions} data-testid='nbs-item-actions'>
                                <button type='button' className={styles.nbsMinusButton} disabled={item.min ? item.number === item.min : item.number === 0} data-testid='nbs-item-minus-button'></button>
                                <span className={styles.nbsItemNumber} data-testid='nbs-item-number'>{item.number}</span>
                                <button type='button' className={styles.nbsPlusButton} disabled={item.max ? item.number === item.max : false} data-testid='nbs-item-plus-button'></button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}