import { Injectable } from '@angular/core';
import * as formLayout from '../config/form.json';
import { GroupField, SimpleField } from '../models/form';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  rawData: any;
  _value: any;
  _data: any;

  set value(value: any) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set data(data: any) {
    this._data = data;
  }

  get data(): Array<SimpleField | GroupField> {
    return this._data;
  }

  constructor() {
    this.rawData = formLayout;
    this.data = JSON.parse(JSON.stringify(formLayout)).fields; 
  }


}
