import type { ISymbolValue } from "./types/IProduct";

export const symbolicUtils = {
    parseSymbolic,
    stringifySymbolic,
    replaceValue,
    getSymValAt,
    include
}

function parseSymbolic(definition: string[], symbolic: string): ISymbolValue[] {
    const result: ISymbolValue[] = [];

    for (let i = 0; i < definition.length; i++) {
        const startIdx = i + (i > 11 ? 1 : 0);
        const length = i === 11 ? 2 : 1;
        const symVal = symbolic.substring(startIdx, startIdx + length);
        result.push({ symKey: definition[i], symVal });
    }

    return result;
}


function stringifySymbolic(source: ISymbolValue[]): string {
    return source.join("");
}

function replaceValue(source: string, idx: number, val: string) {
    const startIdx = idx + (idx > 11 ? 1 : 0);
    const length = idx === 11 ? 2 : 1;

    if (val.length !== length) {
        throw new Error(`Nieprawidłowa długośc dla ${idx} pola symboliki. Oczekiwano ${length}, otrzymano=${val.length}`);
    }

    return source.substring(0, startIdx) +
        val +
        source.substring(startIdx + length);
}

// indeksacja od 0
function getSymValAt(idx: number, symbolic: string) {
    const startIdx = idx + (idx > 11 ? 1 : 0);
    const length = idx === 11 ? 2 : 1;

    return symbolic.substring(startIdx, startIdx + length);
}

function include(definition: string[], symbolic: string, includeList: ISymbolValue[]) {
    for (const includePart of includeList) {
        const cechaIdx = definition.findIndex(v => v === includePart.symKey);
        if (cechaIdx == null) {
            throw new Error(`W definicji symboliki nie znaleziono cechy: ${includePart.symKey}`);
        }
        if (getSymValAt(cechaIdx, symbolic) !== includePart.symVal) {
            return false;
        }
    }
    return true;
}