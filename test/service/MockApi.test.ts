import { describe } from "mocha";
import { expect, assert } from 'chai';
import { IInitConfigDataProps } from "@@/api";
import { MockApi } from "@@/MockApi";

describe('MockApi', function () {
    const mock = new MockApi();

    describe('mock.initKonfigurator()', function () {
        it('works', async function () {
            await mock.initKonfigurator();
        });
    });

    describe('mock.sendToCart()', function () {
        it('works', async function () {
            try {
                const props: any = null;
                await mock.sendToCart(props);
            } catch (error) {
                assert(error instanceof Error && error.message === "Method not implemented.");
            }
        });
    });

    describe('mock.initConfigData()', function () {
        it('works', async function () {
            const props: IInitConfigDataProps = { productCode: 'SPWPMB0L08UBI0SZ20O000', productFamilyCode: 'SSVCS' }
            const configData = await mock.initConfigData(props);
            expect(configData).to.have.property("products");
            expect(configData.products).to.be.an("object")
            expect(configData.products.door).to.be.an("object")
            expect(configData.products.door?.family).equals("SSVCS")
            expect(configData.products.door?.symbolic).equals("SPWPMB0L08UBI0SZ20O000")
        });
    });

    describe('mock.getOptions()', function () {
        it('works', async function () {
            const props: IInitConfigDataProps = { productCode: 'SPWPMB0L08UBI0SZ20O000', productFamilyCode: 'SSVCS' }
            const configData = await mock.initConfigData(props);
            const fieldOptions = await mock.getFieldOptions(configData, "PL");
            expect(fieldOptions).to.be.an("array")
            expect(fieldOptions.length).equals(10);
        });
    });

    describe('mock.updateConfigData()', function () {
        it('works', async function () {
            const props: IInitConfigDataProps = { productCode: 'SPWPMB0L08UBI0SZ20O000', productFamilyCode: 'SSVCS' }
            const configData = await mock.initConfigData(props);
            const fieldOptions = await mock.getFieldOptions(configData, "PL");
            const pickedOption = fieldOptions.find(v => v.cecha === "KOLOR")?.options[0];
            if (pickedOption == null) {
                throw new Error(`pickedOption is null`);
            }
            const updateConfigData = await mock.updateConfigData(configData, pickedOption);
            expect(updateConfigData.products.door?.family).equals("SSVCS")
            expect(updateConfigData.products.door?.symbolic).equals("SPWPMB0L08LBI0SZ20O000")
        });
    });

    describe('mock.updateConfigData() then mock.getOptions()', function () {
        it('works', async function () {
            const props: IInitConfigDataProps = { productCode: 'SPWPMB0L08UBI0SZ20O000', productFamilyCode: 'SSVCS' }
            const configData = await mock.initConfigData(props);
            const fieldOptions = await mock.getFieldOptions(configData, "PL");
            const pickedOption = fieldOptions.find(v => v.cecha === "KOLOR")?.options[0];
            expect(pickedOption?.active).equals(false);
            if (pickedOption == null) {
                throw new Error(`pickedOption is null`);
            }
            const updateConfigData = await mock.updateConfigData(configData, pickedOption);
            const newOptions = await mock.getFieldOptions(updateConfigData, "PL");
            const cechaKolor = newOptions.find(v => v.cecha === "KOLOR");
            const newPickedOption = cechaKolor?.options.find(v => v.optionId === pickedOption.optionId);
            expect(newPickedOption?.active).equals(true);
        });
    });
});