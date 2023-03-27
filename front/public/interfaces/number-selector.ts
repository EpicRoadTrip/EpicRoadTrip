export interface INumberSelector {
    title: string,
    items: INumberSelectorData[],
}

interface INumberSelectorData {
    id: number,
    name: string,
    number: number,
    min?: number,
    max?: number,
    apiName: string,
}