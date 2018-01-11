import { ObservableConverter } from './observable-converter';
import { PromiseConverterImpl } from './promise-converter';
import { isNull, isUndefined } from 'util';

export interface PromiseConverter {
  convert(promise: Promise<any>): any;
  accept(convertTo: any): boolean;
}

export class PromiseConverterStore {
  private static converters: PromiseConverter[] = [];

  static addConverter(converter: PromiseConverter): void {
    this.converters.push(converter);
  }

  static getConverterFor(convertTo: any): PromiseConverter {
    if (isNull(convertTo) || isUndefined(convertTo)) {
      return new PromiseConverterImpl();
    }

    return this.converters.filter(c => c.accept(convertTo))[0];
  }
}

PromiseConverterStore.addConverter(new ObservableConverter());
PromiseConverterStore.addConverter(new PromiseConverterImpl());
