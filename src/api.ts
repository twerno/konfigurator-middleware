import type { ISymbolValue } from "./types/IProduct";

export interface IPortaKonfiguratorApi {

    // wprowadzenie zmian do obecnego configData
    updateConfigData(configData: IPortaConfigData, option: IPortaConfigOption): Promise<IPortaConfigData>;

    // lista cech i opcji do konfiguracji
    getFieldOptions(configData: IPortaConfigData, lang: string): Promise<IPortaConfigField[]>

    // generuje wizualizację configData
    // docelowe wizualizacje mogą różnić się wymiarami np. drzwi podwójne; panele górne lub boczne
    getImage(configData: IPortaConfigData): Promise<HTMLCanvasElement>

    // podsumowanie configData
    configDataSummary(configData: IPortaConfigData): Promise<IConfigDataSummary>

    // =============================================================
    // dedykowane dla X-COM
    // =============================================================

    // wczytanie słowników
    initKonfigurator(): Promise<void>

    // inicjalizacja nowego produktu, na wejściu przekazanie danych z fantoma
    initConfigData(props: IInitConfigDataProps): Promise<IPortaConfigData>

    // wczytuje istniejącą konfigurację
    loadConfiguration(configurationId: string): Promise<IPortaConfigData>

    // zapisuje konfiguracje i zwraca nowe id
    saveConfiguration(configData: IPortaConfigData, lang: string): Promise<string>

    // wysłanie zamówienia do koszyka
    // TODO - usługi: montaż, pakiet bezpieczeństwa
    sendToCart(props: ISendToCartProps): Promise<void>
}

export type IPortaConfigField = {
    cecha: ICechaId,
    options: IPortaConfigOption[],

    // czy cecha wpływa na obrazek
    updatesPicture: boolean,

    status: IStatusType
    statusMsg?: string
}

export type IPortaConfigOption = {
    optionId: string
    label: string
    priceDelta: number
    iconUrl?: string
    active: boolean

    enabled: boolean
    status: IStatusType
    statusMsg?: string

    configDataDelta: IPortaConfigDataDelta
}

export type IPortaKonfiguratorApiProps = {
    serverUrl: string,
    lang: string
}

export type IPortaConfigData = {
    products: {
        door?: {
            family: string,
            symbolic: string,
        }

        frame?: {
            family: string,
            symbolic: string,
        }

        accessories: {
            type: IAccessoryType
            symbolic: string,
        }[]
    }
}

export type IPortaConfigDataDelta = ISymbolValue[];

export type IConfigDataSummary = {
    // wszystkie ceny:
    // netto, katalogowa, wyrazona w pelnych zlotowkach
    // prezentacja promocji cenowych po stronie X-COM
    price: number,

    status: Exclude<IStatusType, 'suggestion'>

    door?: {
        familyName: string
        modelName: string
        price: number
        features: ICechaFeatureSummary[]
        imageUrl: string
    }

    frame?: {
        familyName: string
        modelName: string
        price: number
        features: ICechaFeatureSummary[]
        imageUrl: string
    }

    accessories: {
        type: IAccessoryType
        accessoryName: string
        price: number
        features: ICechaFeatureSummary[]
        imageUrl: string
    }[]
}

export type ICechaFeatureSummary = {
    cecha: ICechaId,
    optionLabel: string,
    status: IStatusType
    statusMsg?: string
}

export type IStatusType = 'ok' | 'warning' | 'error' | 'suggestion';
export type ICechaId = string;
export type IAccessoryType = 'handle' | 'lock' | 'bathroom_lock' | '...';

export type ISendToCartProps = {
    configData: IPortaConfigData,
    // TODO
    userId: string,
    configurationId: string
}

export type IInitConfigDataProps = {
    // [X-COM] Kod grupy towarów PORTA === [PORTA] family
    productFamilyCode: string

    // [X-COM] Kod towaru PORTA === [PORTA] symbolic
    productCode: string
}


// TODO - raportowanie błędów
