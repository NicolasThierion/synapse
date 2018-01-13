import { RequestContentTypeConverter } from './request-converter-store';
export declare class JsonConverter implements RequestContentTypeConverter {
    convert(body: any, request: Request): Promise<Request>;
    static accept(body: any): boolean;
}
