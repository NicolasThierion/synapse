
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { HttpMethod } from '../../../../src/core';
import JSONFormatter from 'json-formatter-js';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

import { isObject } from 'lodash';
let count = 0;

type paramType = 'object' | 'number' | 'string';

@Component({
  selector: 'ack-synapse-bench',
  templateUrl: './synapse-bench.component.html',
  styleUrls: ['./synapse-bench.component.scss']
})
export class SynapseBenchComponent implements OnInit, OnChanges {
  @ViewChild('resultContent') content: ElementRef;

  @Input()
  public name: string;

  @Input()
  public method: HttpMethod = HttpMethod.GET;

  @Input()
  public parameters: {[param: string]: paramType} = {};

  @Input()
  public fn: Function = () => {};

  public elementId: string;
  public paramNames: string[];
  public paramTypes: paramType[];
  public paramValues: paramType[];
  private isError: boolean;
  private isSubmit: boolean;

  constructor() { }

  ngOnInit() {
    this.elementId = `ack-bench-${count++}`;

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.parameters) {
      this.paramNames = Object.keys(this.parameters);
      this.paramTypes = this.paramNames.map(p => this.parameters[p]);
      this.paramValues = [];
    }
  }

  getParamType(name: string): paramType {
    return this.parameters[name];
  }

  paramsString() {
    return this.paramNames
      .reduce((params, param, index) => params.concat(`${param}: ${this.paramTypes[index]}`), [])
      .join(', ');
  }

  submit() {
    this.isSubmit = true;
    const res = this.fn.apply(null, this.paramValues);
    ((res.then ? Observable.fromPromise(res) : res) as Observable<any>)
      .subscribe(this._handleResponse.bind(this), this._handleError.bind(this));
  }

  /* ***
   * Private
   */
  private _handleResponse(o: any) {
    this.isError = false;
    const formatter = new JSONFormatter(o);
    const renderedEl = formatter.render();
    const ne = this.content.nativeElement;
    if (ne.firstChild) {
      ne.replaceChild(renderedEl, ne.firstChild);
    } else {
      ne.appendChild(renderedEl);
    }
  }

  private _handleError(o: any) {
    this.isError = true;

    const ne = this.content.nativeElement;
    if (o instanceof Error) {
      ne.innerText = o.message;
    } else {
      const formatter = new JSONFormatter(o);
      const renderedEl = formatter.render();
      const ne = this.content.nativeElement;
      if (ne.firstChild) {
        ne.replaceChild(renderedEl, ne.firstChild);
      } else {
        ne.appendChild(renderedEl);
      }
    }
  }
}
