import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import JSONFormatter from 'json-formatter-js';
import { Observable } from 'rxjs/Observable';

import { cloneDeep, isObject } from 'lodash';
import { SynapseMethod } from '../../../../../src/core/synapse-method.type';
import { SynapseMergedConfig } from '../../../../../src/utils';
let count = 0;

type paramType = 'object' | 'number' | 'string';

@Component({
  selector: 'syn-bench',
  templateUrl: './synapse-bench.component.html',
  styleUrls: ['./synapse-bench.component.scss']
})
export class SynapseBenchComponent implements OnInit, OnChanges {
  @ViewChild('resultContent') resultContent: ElementRef;
  @ViewChild('configContent') configContent: ElementRef;

  @Input()
  public name: string;

  @Input()
  public parameters: {[param: string]: paramType} = {};

  @Input()
  public defaultParameters: any[] = [];

  @Input()
  public fn: Function = (() => {});

  public elementId: string;
  public paramNames: string[];
  public paramTypes: paramType[];
  public paramValues: paramType[] = [];
  public conf: SynapseMergedConfig = {};
  public trackByIndex = (index: number) => index;

  public isError: boolean;
  public isSubmit: boolean;

  constructor() { }

  ngOnInit(): void {
    this.elementId = `ack-bench-${count++}`;
    this.name = this.name || this.fn.name;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.parameters && changes.parameters.currentValue) {
      this.paramNames = Object.keys(this.parameters);
      this.paramTypes = this.paramNames.map(p => this.parameters[p]);
      this.paramValues = [];
    }

    if (changes.fn && changes.fn.currentValue) {
      this.conf = (this.fn as SynapseMethod).synapseConfig;

      const conf = cloneDeep(this.conf);
      delete conf.method;
      delete conf.httpBackend;
      // if (conf.mapper) {
      //   debugger
      //   conf.mapper = conf.mapper.name as any;
      // }

      const formatter = new JSONFormatter(conf);
      const renderedEl = formatter.render();
      const ne = this.configContent.nativeElement;
      if (ne.firstChild) {
        ne.replaceChild(renderedEl, ne.firstChild);
      } else {
        ne.appendChild(renderedEl);
      }

    }

    if (changes.defaultParameters && changes.defaultParameters.currentValue) {
      this.paramValues = this.defaultParameters.map(p => {
        if (isObject(p)) {

          return JSON.stringify(p);
        }

        return p;
      });
    }

    if (changes.name && !changes.name.currentValue) {
      this.name = this.fn.name;
    }
  }

  getParamType(name: string): paramType {
    return this.parameters[name];
  }

  paramsToString(): string {
    return this.paramNames
      .reduce((params, param, index) => params.concat(`${param}: ${this.paramTypes[index]}`), [])
      .join(', ');
  }

  submit(): void {
    this.isSubmit = true;

    try {
      const params = [];
      for (let i = 0; i < this.paramValues.length; ++i) {
        if (this.paramValues[i]) {
          params[i] = this.getParamType(this.paramNames[i]) === 'object' ?
            JSON.parse(this.paramValues[i]) : this.paramValues[i];
        }
      }

      const res = this.fn.apply(null, params);
      ((res.then ? Observable.fromPromise(res) : res) as Observable<any>)
        .subscribe(this._handleResponse.bind(this), this._handleError.bind(this));
    } catch (e) {
      this._handleError(e);
      throw e;
    }

  }

  /* ***
   * Private
   */
  private _handleResponse(o: any): void {
    this.isError = false;
    const formatter = new JSONFormatter(o);
    const renderedEl = formatter.render();
    const ne = this.resultContent.nativeElement;
    if (ne.firstChild) {
      ne.replaceChild(renderedEl, ne.firstChild);
    } else {
      ne.appendChild(renderedEl);
    }
  }

  private _handleError(o: any): void {
    this.isError = true;

    const ne = this.resultContent.nativeElement;
    if (o instanceof Error) {
      ne.innerText = o.message;
    } else {
      const formatter = new JSONFormatter(o);
      const renderedEl = formatter.render();
      if (ne.firstChild) {
        ne.replaceChild(renderedEl, ne.firstChild);
      } else {
        ne.appendChild(renderedEl);
      }
    }
  }
}
