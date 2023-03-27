import { IInputSelectDropdown, ISelectedInputDropdownData } from '@/public/interfaces/input-select-dropdown'
import { Checkbox, Input, useOutsideClick } from '@chakra-ui/react'
import { Tag, TagCloseButton, TagLabel } from '@chakra-ui/react'
import React from 'react';
import styles from './style/InputSelectDropdown.module.css'

export default function InputSelectDropdown({data, selectedData, onSelectedChange, inputPlaceholder}: IInputSelectDropdown) {
    const ref = React.useRef(null);
    const searchInputRef = React.useRef<HTMLInputElement>(null);;
    const [isDropdownOpen, setDropdownOpen] = React.useState(false);
    const [formattedData, setFormattedData] = React.useState(data ?? []);
    const [formattedSelectedData, setFormattedSelectedData] = React.useState(selectedData ?? []);

    function handleSelectedData(item: ISelectedInputDropdownData, selected: boolean): void {
        let newSelectedData = formattedSelectedData;
        if (selected) {
            if (!formattedSelectedData.some(selectedItem => selectedItem.id === item.id)) {
                newSelectedData = [
                    ...formattedSelectedData,
                    item
                ];
                setFormattedSelectedData([
                    ...formattedSelectedData,
                    item
                ]);
            }
        } else {
            newSelectedData = formattedSelectedData.filter(selectedItem => selectedItem.id !== item.id);
            setFormattedSelectedData(newSelectedData);
        }
        if (onSelectedChange) {
            onSelectedChange(newSelectedData);
        }
    }

    function isInputSelected (item: ISelectedInputDropdownData): boolean {
        return formattedSelectedData.some(selectedItem => selectedItem.id === item.id)
    }

    function search(search: string): void {
        if (search && search.length > 0) {
            if (data) {
                setFormattedData(data.slice().filter((item) => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())));
            }
        } else {
            setFormattedData(data ?? []);
        }
    }

    function handleOpenDropdown(): void {
        setDropdownOpen(true);
        setTimeout(() => { // Wait 100ms before setting the focus on input
            searchInputRef.current?.focus();
        }, 100);
    }

    useOutsideClick({
        ref: ref,
        handler: () => setDropdownOpen(false),
    });

    return (
        <div ref={ref} className={styles.isdContainer} data-testid="isd-container" onClick={handleOpenDropdown}>
            <div className={`${styles.isdHeader} ${isDropdownOpen ? styles.active : ""}`} data-testid="isd-header">
                <div className={styles.isdChipContainer} data-testid="isd-display-chip-container">
                    {formattedSelectedData.map(selectedItem => (
                        <Tag key={selectedItem.id} borderRadius="full" data-testid="isd-tag" colorScheme='facebook'>
                            <TagLabel>{selectedItem.name}</TagLabel>
                            <TagCloseButton onClick={() => handleSelectedData(selectedItem, false)} data-testid="isd-tag-close" />
                        </Tag>
                    ))}
                </div>
                <Input
                    type='text'
                    variant='unstyled'
                    borderRadius="none"
                    ref={searchInputRef}
                    onChange={e => search(e.currentTarget.value)}
                    placeholder={inputPlaceholder ? inputPlaceholder : "Select a type"}
                    className={`${styles.isdInputSearch} ${formattedSelectedData.length > 0 && !isDropdownOpen ? styles.closeSelectedActive : ""}`} data-testid="isd-input-search"/>
            </div>
            <div className={`${styles.isdBody} ${isDropdownOpen ? styles.active : ""}`} data-testid="isd-body">
                {formattedData.length > 0  ? formattedData.map(item => (
                    <Checkbox
                        key={item.id}
                        className={styles.isdBodyItem}
                        data-testid='isd-checkbox'
                        isChecked={isInputSelected(item)}
                        defaultChecked={isInputSelected(item)}
                        onChange={e => handleSelectedData(item, e.currentTarget.checked)}>
                         {item.name}
                    </Checkbox>
                )) : (
                    <span className={styles.isdNoDataMessage}>
                        Aucune données disponible{ searchInputRef.current?.value ? " pour la recherche" : "" }
                    </span>
                )
                }
            </div>
        </div>
    )
}

