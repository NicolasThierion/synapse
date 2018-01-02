import { ObservableConverter } from './observable-converter';
import { PromiseConverterImpl } from './promise-converter';
import { isNull, isUndefined } from 'util';

export interface PromiseConverter<T> {
  convert(promise: Promise<any>): T;
  accept(convertTo: any): boolean;
}

export class PromiseConverterStore {
  private static converters: PromiseConverter<any>[] = [];

  static addConverter<T>(converter: PromiseConverter<any>) {
    this.converters.push(converter);
  }

  static getConverterFor(convertTo: any): PromiseConverter<any> {
    if (isNull(convertTo) || isUndefined(convertTo)) {
      return new PromiseConverterImpl();
    }

    return this.converters.filter(c => c.accept(convertTo))[0];
  }
}

PromiseConverterStore.addConverter(new ObservableConverter());
PromiseConverterStore.addConverter(new PromiseConverterImpl());
