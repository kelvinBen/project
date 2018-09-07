import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import 'rxjs/add/operator/map'

@Injectable()
export class ApiService {
  public id: Number;
  redirectUrl: string;
  url = '/api';
  constructor(private http: HttpClient, private storage: LocalStorageService, private router: Router) { }
  login(email: string, password: string) {
    let postOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json;charset=UTF-8' }) };
    return this.http.post(this.url + '/user/login', JSON.stringify({ email: email, password: password }), postOptions)
  }
  loginout() {
    this.storage.clear('CurrentUser');
  }
  getMenu(user_id) {
    return this.http.get(this.url + '/entity/menu?user_id=' + user_id);
  }
  getListData(entity_type_id) {
    return this.http.get(this.url + '/entity/values?entity_type_id=' + entity_type_id);
  }
  getListsAndConfig(entity_type_id, user_id) {
    return this.http.get(this.url + '/entity/list?entity_type_id=' + entity_type_id + '&user_id=' + user_id);
  }
  getEditData(entity_type_id) {
    return this.http.get(this.url + '/entity/attributes?entity_type_id=' + entity_type_id);
  }
}