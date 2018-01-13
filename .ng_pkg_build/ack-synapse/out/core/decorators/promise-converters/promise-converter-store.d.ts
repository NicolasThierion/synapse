export interface PromiseConverter {
    convert(promise: Promise<any>): any;
    accept(convertTo: any): boolean;
}
export declare class PromiseConverterStore {
    private static converters;
    static addConverter(converter: PromiseConverter): void;
    static getConverterFor(convertTo: any): PromiseConverter;
}
