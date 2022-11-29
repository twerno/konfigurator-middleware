import { MockApi } from "MockApi";

const mock: MockApi = new MockApi();

async function exampleFlow() {

    // przygotowanie konfiguratora do pracy: pobranie slowników
    // docelowo ten krok będzie wymagał przekazania parametrów np. adresu serwera ze słownikamia, domyślnego języka lub adresu serwera obrazków
    await mock.initKonfigurator();

    // inicjalizacja nowego produktu, na wejściu przekazanie danych z fantoma
    // productFamilyCode: string
    // [X-COM] Kod grupy towarów PORTA === [PORTA] family
    // productCode: string
    // [X-COM] Kod towaru PORTA === [PORTA] symbolic
    const configuratorState = await mock.initConfigData({ productFamilyCode: 'SSVCS', productCode: 'SPWPMB0L08UBI0SZ20O000' })

    // pobranie listy dostępnych opcji, 
    // docelowo możliwość wskazania języka
    const optionsFields = await mock.getFieldOptions(configuratorState, "PL");

    // pobranie canvasa z wizualizacją stanu konfiguratora
    const convas = await mock.getImage(configuratorState);

    // podsumowanie stanu konfiguratora
    // dla ekranu podsumowania, być może część danych będzie potrzeba wcześniej
    const summary = await mock.configDataSummary(configuratorState);

    // =========================
    // zmiana stanu konfiguratora
    const option = optionsFields.find(field => field.cecha === "KOLOR")?.options[0];
    if (option) {
        // utworzenie nowego stanu na podstawie obecnego i wybranej opcji przez klienta
        const newState = await mock.updateConfigData(configuratorState, option);
    }

}