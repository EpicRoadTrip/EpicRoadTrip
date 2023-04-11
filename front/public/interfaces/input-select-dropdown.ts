export interface IInputSelectDropdown {
    data?: IInputSelectDropdownData[],
    className?: string,
    selectedData?: ISelectedInputDropdownData[],
    onSelectedChange?: (selectedData: ISelectedInputDropdownData[]) => void,
    inputPlaceholder?: string
}

export interface IInputSelectDropdownData {
    id: number,
    name: string,
    apiName: string,
}

export type ISelectedInputDropdownData = IInputSelectDropdownData;