import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Result, RealWeather } from './result';
import { Observable } from 'rxjs/Observable';
import { Horn } from '../index/map/station';
import 'rxjs/Rx';

const baseUrl: string = '/dbapi/';
// const baseUrl: string = 'http://localhost:3111/';
@Injectable()
export class ServerService {
  private options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
  constructor(private http: Http) { }
  //获取文件列表，子类和个数
  queryDocByParame(subId, num): Observable<Result> {
    let url: string = baseUrl + 'home/docByParameter';
    var par = { subId: subId, num: num };
    return this.http.post(url, JSON.stringify(par), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // getWarning(): Observable<Result> {
  //   let url: string = baseUrl + 'home/warning';
  //   return this.http.get(url, this.options)
  //     .map(this.extractData)
  //     .catch(this.handleError);
  // }

  category(): Observable<Result> {
    let url: string = baseUrl + 'home/category';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  categoryEx(id): Observable<Result> {
    let url: string = baseUrl + 'home/category/' + id;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  subCategory(): Observable<Result> {
    let url: string = baseUrl + 'home/subcategory';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  subCategoryEx(id): Observable<Result> {
    let url: string = baseUrl + 'home/subcategory/' + id;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  fileCount(subId): Observable<Result> {
    let url: string = baseUrl + 'home/queryFileCount';
    var par = { subId: subId };
    return this.http.post(url, par, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  filelist(subId, pageNum, page): Observable<Result> {
    let url: string = baseUrl + 'home/fileList';
    var par = { subId: subId, pageNum: pageNum, page: page };
    return this.http.post(url, JSON.stringify(par), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  fileCountEx(subId): Observable<Result> {
    let url: string = baseUrl + 'home/queryFileCountEx';
    var par = { subId: subId };
    return this.http.post(url, par, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  stationFileCountEx(userId, subId): Observable<Result> {
    let url: string = baseUrl + 'home/queryStationFileCount';
    var par = { userId: userId, subId: subId };
    return this.http.post(url, par, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  filelistEx(subId, pageNum, page): Observable<Result> {
    let url: string = baseUrl + 'home/fileListEx';
    var par = { subId: subId, pageNum: pageNum, page: page };
    return this.http.post(url, JSON.stringify(par), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  stationFilelistEx(userId, subId, pageNum, page): Observable<Result> {
    let url: string = baseUrl + 'home/stationFileListEx';
    var par = { userId: userId, subId: subId, pageNum: pageNum, page: page };
    return this.http.post(url, JSON.stringify(par), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  //后台users
  userCount(): Observable<Result> {
    let url: string = baseUrl + 'admin/users';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  //后台添加users
  submitUsers(obj): Observable<Result> {
    let url: string = baseUrl + 'admin/useradd';
    return this.http.post(url, JSON.stringify(obj), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  //后台编辑users
  editUsers(obj): Observable<Result> {
    let url: string = baseUrl + 'admin/useredit/' + obj.Id;
    return this.http.put(url, JSON.stringify(obj), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  //后台user detailid
  userById(id): Observable<Result> {
    let url: string = baseUrl + 'admin/user/' + id;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  //后台user delete
  deleteUsers(id): Observable<Result> {
    let url: string = baseUrl + 'admin/deleteuser/' + id;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  //后台log
  logCount(): Observable<Result> {
    let url: string = baseUrl + 'admin/log';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }


  login(obj): Observable<Result> {
    let url: string = baseUrl + 'user/login';
    return this.http.post(url, JSON.stringify(obj), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  //后台 添加
  submitNews(obj): Observable<Result> {
    let url: string = baseUrl + 'admin/adminNewsadd';
    return this.http.post(url, JSON.stringify(obj), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  //工作日志添加
  submitNewsEx(obj): Observable<Result> {
    let url: string = baseUrl + 'admin/adminNewsaddEx';
    return this.http.post(url, JSON.stringify(obj), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  //后台新闻编辑接口
  editNews(obj): Observable<Result> {
    let url: string = baseUrl + 'admin/adminNewsedit/' + obj.Id;
    return this.http.put(url, JSON.stringify(obj), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  //后台新闻编辑接口
  editNewsEx(obj): Observable<Result> {
    let url: string = baseUrl + 'admin/adminNewseditEx/' + obj.Id;
    return this.http.put(url, JSON.stringify(obj), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  //删除
  deletecon(id): Observable<Result> {
    let url: string = baseUrl + 'admin/delete/' + id;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  //删除
  deleteconEx(id): Observable<Result> {
    let url: string = baseUrl + 'admin/deleteEx/' + id;
    return this.http.delete(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  //后台审核日志
  editLogStatus(obj): Observable<Result> {
    let url: string = baseUrl + 'admin/adminLogStatus/' + obj.Id;
    return this.http.put(url, JSON.stringify(obj), this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  detailById(id): Observable<Result> {
    let url: string = baseUrl + 'home/file/' + id;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  detailByIdEx(id): Observable<Result> {
    let url: string = baseUrl + 'home/fileEx/' + id;
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  warning(): Observable<Result> {//当前最新的预警
    let url: string = 'api/Warning?num=1';
    return this.http.get('http://www.lintongqx.com/apis/api/warning?num=1', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  warningList(): Observable<Result> {//预警列表
    let url: string = 'api/Warning?num=-1';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  warningById(id): Observable<Result> {//预警列表
    let url: string = 'api/Warning?id=' + id;
    return this.http.post(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  forcast(): Observable<Result> {//当前最新的文档
    let url: string = 'api/Forcast';
    return this.http.get('http://www.lintongqx.com/apis/api/forcast', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  //最新实况
  realWeather(): Observable<RealWeather[]> {
    return this.http.get('http://www.lintongqx.com/apis/Default/GetRealWeath', this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  stations(): Observable<Result> {
    let url: string = baseUrl + 'map/stations';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  adminstation(): Observable<Result> {
    let url: string = baseUrl + 'home/category';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  //
  horns(): Observable<Horn[]> {
    let url: string = 'http://www.lintongqx.com/apis/Default/GetHorns';
    return this.http.get(url, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
