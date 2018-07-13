import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {LocalStorageService} from 'ngx-webstorage';
import { LoginUser } from '../models/user';
@Injectable()
export class ProductService {
   url = 'https://end.extraweather.com';
  constructor(private http: HttpClient,private storage:LocalStorageService) { }
  getProducts() {
    return this.http.get(this.url + '//api/getuserproducts', { headers:this.jwt(), params:this.params()})
  }
  getOrders() {
    return this.http.get(this.url +'/api/getorders',{ headers:this.jwt(),params:this.params()} )
  }
  getOrderDetail(orderid) {
    return this.http.get(this.url +'/api/getorderdetail',{ headers:this.jwt(),params:{"orderid":orderid}} )
  }
  addOrder(body) {
    return this.http.post(this.url + '/api/addorder',body,{ headers:this.jwt(),params:this.params()})
  }
  deleteOrder(id){
     return this.http.post(this.url + '/api/cancelorder',{"id":id});
  }
  updateUser(email,password){
    return this.http.post(this.url +'/api/update',{"email":email,"password":password},{ headers:this.jwt()})
  }
  getServices(userid){
    return this.http.get(this.url + '/api/getuserservice',{params:{"userid":userid}})
  }
  startService(id){
    return this.http.post(this.url + '/api/startservice',{"id":id})
  }
  endService(id){
    return this.http.post(this.url + '/api/endservice',{"id":id})
  }
  getRoleProduct(){
    return this.http.get(this.url + '/getroleproduct');
  }
  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     console.error('An error occurred:', error.error.message);
  //   } else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong,
  //     console.error(
  //       `Backend returned code ${error.status}, ` +
  //       `body was: ${error.error}`);
  //   }
  //   // return an observable with a user-facing error message
  //   return throwError(
  //     'Something bad happened; please try again later.');
  // };
  private jwt() {
    // create authorization header with jwt token
    let currentUser = this.storage.retrieve('CurrentUser') as LoginUser;
    if (currentUser && currentUser.token) {
      let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + currentUser.token });
      return headers;
    }
  }
   private params() {
    let currentUser = this.storage.retrieve('CurrentUser') as LoginUser;
    if (currentUser && currentUser.id) {
      let params = new HttpParams().set("userid",(currentUser.id).toString());
      return params;
    }
  }
}
