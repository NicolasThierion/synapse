import { RequestContentTypeConverter } from './request-converter-store';
export declare class UrlencodedTxConverter implements RequestContentTypeConverter {
    convert(body: any, request: Request): Promise<Request>;
    static accept(body: any): boolean;
}
