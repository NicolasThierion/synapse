import { PromiseConverter } from './promise-converter-store';
import { Observable } from 'rxjs/Observable';
export declare class ObservableConverter implements PromiseConverter {
    convert<T>(promise: Promise<T>): Observable<T>;
    accept(convertTo: any): boolean;
}
