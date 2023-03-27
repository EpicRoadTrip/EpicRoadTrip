import { INumberSelector, INumberSelectorData } from '@/public/interfaces/number-selector';
import React from 'react';
import styles from './style/NumberSelector.module.css';

export default function NumberSelector({ title, items, onChange }: INumberSelector) {

    React.useEffect(() => {
        if (items) {
            setData(items.map((item) => {
                if (item.min && item.min >= 0) {
                    item.number = item.min;
                }
                return item;
            }));
        }
    }, [items]);

    const [data, setData] = React.useState(items ?? []);

    const increment = (item: INumberSelectorData) => {
        const findedData = data.find((element) => element.id === item.id);

        if (findedData) {
            findedData.number++;
            setData([...data]);
        }

        handleOnChange();
    };

    const decrement = (item: INumberSelectorData) => {
        const findedData = data.find((element) => element.id === item.id);

        if (findedData) {
            findedData.number--;
            setData([...data]);
        }

        handleOnChange();
    };

    function handleOnChange(): void {
        if (onChange) {
            onChange(data);
        }
    }

    return (
        <div className={styles.nbsContainer} data-testid='nbs-container'>
            <h2 className={styles.nbsTitle} data-testid='nbs-title'>{title ?? "Veuillez insérer un titre"}</h2>
            <div className={styles.nbsBody} data-testid='nbs-body'>
                {
                    data.map((item) => (
                        <div key={item.id} className={styles.nbsBodyItem} data-testid='nbs-body-item'>
                            <p className={styles.nbsBodyItemName} data-testid='nbs-item-name'>{item.name}</p>
                            <div className={styles.nbsBodyItemActions} data-testid='nbs-item-actions'>
                                <button type='button' className={styles.nbsMinusButton} onClick={() => {decrement(item)}} disabled={item.min ? item.number === item.min : item.number === 0} data-testid='nbs-item-minus-button'></button>
                                <span className={styles.nbsItemNumber} data-testid='nbs-item-number'>{item.number}</span>
                                <button type='button' className={styles.nbsPlusButton} onClick={() => {increment(item)}} disabled={item.max ? item.number === item.max : false} data-testid='nbs-item-plus-button'></button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}