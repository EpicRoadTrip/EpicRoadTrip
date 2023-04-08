export interface INumberSelector {
    title: string,
    items: INumberSelectorData[],
    onChange?: (items: INumberSelectorData[]) => void,
}

export interface INumberSelectorData {
    id: number,
    name: string,
    number: number,
    min?: number,
    max?: number,
    apiName: string,
}