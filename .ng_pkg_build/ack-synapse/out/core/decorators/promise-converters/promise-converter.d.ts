import { PromiseConverter } from './promise-converter-store';
export declare class PromiseConverterImpl implements PromiseConverter {
    convert<T>(promise: Promise<T>): Promise<T>;
    accept(convertTo: any): boolean;
}
