export interface IProduct {
    id: number,
    type: string, //TProductType,
    name: string,

    family: string,
    configuration: {
        colors: IColor[],
        models: IProductModel[],
        options: IProductsymKeyOptionsMap,
    }

    symbolicDefList: string[],
}

export interface IProductModel {
    name: string,
    symbolValues: ISymbolValue[]
}

export interface ISymbolValue {
    symKey: string,
    symVal: string
}

export function isSymbolicValue(x: any): x is ISymbolValue {
    return x instanceof Object
        && 'symKey' in x
        && 'symVal' in x;
}

export type IProductsymKeyOptionsMap = Record<string, { label: string, symVal: string }[]>

export interface IColor extends IProductModel {
    group: number,
}

export interface IAccessoryProduct {
    type: string,
    // subType: string[],
    typeName: string,
    symbolic: string,
    name: string,
    price: number
    //"minQty":1.0,"unit":"mb"
    // group: USZCZELKI
}