export interface IInputSelectDropdown {
    data?: IInputSelectDropdownData[],
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