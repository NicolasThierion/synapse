import { RequestContentTypeConverter } from './request-converter-store';
export declare class TextConverter implements RequestContentTypeConverter {
    convert(body: any, request: Request): Promise<Request>;
}
