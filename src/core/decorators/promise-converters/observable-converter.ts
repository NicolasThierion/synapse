import { PromiseConverter } from './promise-converter-store';
import { Observable } from 'rxjs/Observable';

export class ObservableConverter implements PromiseConverter {
  convert<T>(promise: Promise<T>): Observable<T> {
    return Observable.fromPromise(promise);
  }

  accept(convertTo: any): boolean {
    return convertTo instanceof Observable;
  }
}
