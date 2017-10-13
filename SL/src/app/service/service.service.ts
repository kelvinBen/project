import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';
const baseUrl: string = 'http://117.34.117.196:9001/';
@Injectable()
export class ServiceService {
  private options = new RequestOptions({
    headers:
    new Headers({ 'Content-Type': 'application/json;charset=utf-8' })
  });
  private postOptions = new RequestOptions({
    headers:
    new Headers({
      'Content-Type': 'application/json;charset=utf-8',
      'Prefer': 'return=representation'
    })
  });

  constructor(private http: Http) { }
  Get(table, par): Observable<object[]> {
    let url: string = baseUrl + table;
    if (par) url += par;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  Patch(table, par, body): Observable<object[]> {
    let url: string = baseUrl + table + par;
    return this.http.patch(url, JSON.stringify(body), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  Post(table, body): Observable<object[]> {
    let url: string = baseUrl + table;
    return this.http.post(url, JSON.stringify(body), this.postOptions)
      .map(this.extractData)
      .catch(this.handleError);
  }
  Delete(table, par): Observable<object[]> {
    let url: string = baseUrl + table + par;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  private extractData(res: Response) {
    if (res.status == 201) return res.json() || {};
    let body = res.json();
    return body || {};
  }
  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(error);
  }
}
