import { previewBuilder } from "previewBuilder";
import type { IConfigDataSummary, IInitConfigDataProps, IPortaConfigData, IPortaConfigField, IPortaConfigOption, IPortaKonfiguratorApi, ISendToCartProps } from "./api";
import { products } from "./db";
import { symbolicUtils } from "./symbolicUtils";
import type { IProduct } from "./types/IProduct";

const konfigurowalneCechy_SSVCS = ["03-RODZAJ", "08-STRONA", "10-ROZMIAR2", "13-SKR-WYPOSAZ", "14-OKUC-KOLOR", "15-ZAMEK", "16-ZAWIAS", "18-SKR-WYPEL"];
const COLOR_KEY_NAME = "KOLOR";
const MODEL_KEY_NAME = "MODEL";

export class MockApi implements IPortaKonfiguratorApi {
    private productMap: Record<string, IProduct> = {};


    public constructor() {
        const productMap = this.productMap;
        products
            .forEach(product => { productMap[product.family] = product });
    }


    /**
     * nic nie robi
     */
    public async initKonfigurator(): Promise<void> {

    }

    /**
     * 
     */
    public async initConfigData(props: IInitConfigDataProps): Promise<IPortaConfigData> {
        const { productCode, productFamilyCode } = props;

        return {
            products: {
                door: {
                    family: productFamilyCode,
                    symbolic: productCode
                },
                accessories: []
            }
        }
    }


    /**
     * lang - ignorowany
     */
    public async getFieldOptions(configData: IPortaConfigData, lang: string): Promise<IPortaConfigField[]> {
        const product = this.getProductByFamily(configData.products.door?.family);

        const result = konfigurowalneCechy_SSVCS.map(cecha => fieldMapper(product, cecha, optionMapper(product, cecha, configData)));
        result.push(fieldMapper(product, COLOR_KEY_NAME, colorMapper(product, configData)));
        result.push(fieldMapper(product, MODEL_KEY_NAME, modelMapper(product, configData)));
        return result;
    }

    /**
     * 
     */
    public async updateConfigData(configData: IPortaConfigData, option: IPortaConfigOption): Promise<IPortaConfigData> {

        const door = configData.products.door ? { ...configData.products.door } : undefined;
        const frame = configData.products.frame ? { ...configData.products.frame } : undefined;
        const accessories = [...configData.products.accessories];

        const configCopy: IPortaConfigData = {
            products: { accessories, door, frame, }
        }

        if (door) {
            let symbolic = door.symbolic;
            const product = this.getProductByFamily(door.family);
            for (const mod of option.configDataDelta) {
                const idx = product.symbolicDefList.findIndex(v => v === mod.symKey);
                symbolic = symbolicUtils.replaceValue(symbolic, idx, mod.symVal);
            }
            door.symbolic = symbolic;
        }

        return configCopy;
    }


    public async configDataSummary(configData: IPortaConfigData): Promise<IConfigDataSummary> {
        const product = this.getProductByFamily(configData.products.door?.family);

        return {
            accessories: [],
            status: 'ok',
            price: 1,
            door: {
                familyName: product.name,
                modelName: 'modelName',
                price: 1,
                features: [
                    {
                        cecha: COLOR_KEY_NAME,
                        status: 'ok',
                        optionLabel: 'kolor'
                    },
                ],
                imageUrl: 'url'
            }
        }
    }


    private getProductByFamily(family?: string): IProduct {
        if (!family) {
            throw new Error("Brak rodziny dla drzwi");
        }
        const product = this.productMap[family];
        if (product == null) {
            throw new Error(`Brak produktu dla rodziny :${family}`);
        }
        return product;
    }


    public async getImage(configData: IPortaConfigData): Promise<HTMLCanvasElement> {
        return previewBuilder(800, 800);
    }

    public async loadConfiguration(configurationId: string): Promise<IPortaConfigData> {
        throw new Error('Method not implemented.');
    }

    public async saveConfiguration(configData: IPortaConfigData, lang: string): Promise<string> {
        throw new Error('Method not implemented.');
    }

    public async sendToCart(props: ISendToCartProps): Promise<void> {
        throw new Error('Method not implemented.');
    }
}



function fieldMapper(product: IProduct, cecha: string, options: IPortaConfigOption[]): IPortaConfigField {
    return {
        cecha,
        options,
        updatesPicture: true,
        status: 'ok',
    }
}

function optionMapper(product: IProduct, cecha: string, configData: IPortaConfigData): IPortaConfigOption[] {
    const opcje = product.configuration.options[cecha];
    if (opcje == null) {
        throw new Error(`[${product.family}] Brak opcji dla cechy ${cecha}`);
    }

    const doorSymbolic = configData.products.door?.symbolic;

    return opcje.map<IPortaConfigOption>((opcja, idx) => ({
        enabled: true,
        label: opcja.label,
        status: 'ok',
        priceDelta: idx,
        configDataDelta: [{ symKey: cecha, symVal: opcja.symVal }],
        get active() { return symbolicUtils.include(product.symbolicDefList, doorSymbolic ?? "", this.configDataDelta) },
        get optionId() { return `${product.family}_${cecha}_${JSON.stringify(this.configDataDelta)}`; },
    }));
}

function colorMapper(product: IProduct, configData: IPortaConfigData): IPortaConfigOption[] {
    const colors = product.configuration.colors;
    if (colors == null) {
        throw new Error(`[${product.family}] Brak opcji dla cechy ${COLOR_KEY_NAME}`);
    }

    const doorSymbolic = configData.products.door?.symbolic;

    return colors.map<IPortaConfigOption>((color, idx) => ({
        enabled: true,
        label: color.name,
        status: 'ok',
        priceDelta: idx,
        configDataDelta: color.symbolValues,
        get active() { return symbolicUtils.include(product.symbolicDefList, doorSymbolic ?? "", this.configDataDelta) },
        get optionId() { return `${product.family}_${COLOR_KEY_NAME}_${JSON.stringify(this.configDataDelta)}`; },
    }))
}

function modelMapper(product: IProduct, configData: IPortaConfigData): IPortaConfigOption[] {
    const models = product.configuration.models;
    if (models == null) {
        throw new Error(`[${product.family}] Brak opcji dla cechy ${MODEL_KEY_NAME}`);
    }

    const doorSymbolic = configData.products.door?.symbolic;

    return models.map<IPortaConfigOption>((model, idx) => ({
        enabled: true,
        label: model.name,
        status: 'ok',
        priceDelta: idx,
        configDataDelta: model.symbolValues,
        get active() { return symbolicUtils.include(product.symbolicDefList, doorSymbolic ?? "", this.configDataDelta) },
        get optionId() { return `${product.family}_${MODEL_KEY_NAME}_${JSON.stringify(this.configDataDelta)}`; },
    }))
}
