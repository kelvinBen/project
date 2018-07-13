import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService, LocalStorage } from 'ngx-webstorage';
import { ProductService } from '../../../service/product.service';
import { Config } from '../myplatform/myplatform.component';
import { Msg } from '../../../models/product';
import { NzModalService } from 'ng-zorro-antd';
import { LoginUser } from '../../../models/user';
interface HttpResult {
  "error_code": number;
  "data": any;
}
// interface phoneCode {
//   "code": number,
//   "msg": null,
//   "data": {
//     "requestId": string,
//     "bizId": string,
//     "code": string,
//     "message": string
//   }
// }
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  @LocalStorage('CurrentUser') curUser:LoginUser;
  userId: Number;
  email: string = '';
  newPassword2:string ='';
  newPassword1:string ='';
  oldPassword:string = '';
  oldPassOk:boolean = false;
  oldPassErr:boolean = false;
  sendPhoneOk: boolean = false;
  sendEmailOk: boolean = false;
  sendEmailErr: boolean = false;
  verification: string = '';
  sendPhoneErr: boolean = false;
  isEmailValid: boolean = true;
  isPhoneValid: boolean = true;
  isNameValid: boolean = true;
  isPassValid: boolean = true;
  curEmail: string;
  curUserName: string;
  userName: string;
  telephone: string;
  url = 'https://end.extraweather.com';
  newUserName: string;
  name: string = '';
  authHeader = new HttpHeaders();
  constructor(private http: HttpClient, private storage: LocalStorageService, private productservice: ProductService, private router: Router, private modalService: NzModalService) {
    
  }
  ngOnInit() {
    this.getUserInfo()
  }
  getUserInfo(){
    var jwt = this.curUser.token;
    if (jwt) {
      this.authHeader.append('Authorization', 'Bearer ' + jwt);
    }
    this.userId =this.curUser.id;
    this.http.get(this.url + '/api/getuser' + '?id=' + this.userId, { headers: this.authHeader }).subscribe(result => {
      let userInfo = result as Config;
      if (!userInfo.code) {
        this.telephone = userInfo.data.telphone;
        this.userName = userInfo.data.userName;
        this.curUserName = userInfo.data.userName;
        this.curEmail = userInfo.data.email;
      }
    })
  }
  ChangeEmail() {
    if (this.curEmail !== this.email) {
      this.http.get(this.url + '/api/activeemail?email='+ this.email).subscribe(result => {
        let info = result as Msg;
        if (!info.code) {
          this.sendEmailOk = true;
          this.getUserInfo();
        } else {
          this.sendEmailErr = true;
        }
      }, error => {
        this.sendEmailErr = true;
      })
    } else {
      this.error("此邮箱已经绑定");
    }
  }
  ChangeUserName() {
    var postData = {
      "userName": this.userName,
      "id": this.curUser.id
    }
    this.http.post(this.url + '/api/changeusername',postData,{ headers: this.authHeader}).subscribe(
      (result) => {
        let res = result as Msg;
        if (!res.code) {
          this.getUserInfo();
          this.success("用户名更新成功");
        } else {
          this.error("用户名更新失败");
        }
      }, error => {
        console.log(error)
      }
    )
  }
  ChangePass(){
    if(!(this.newPassword1||this.newPassword2||this.oldPassword)){
      this.error("密码不能为空");
      return false;
    }
    if(this.newPassword1===this.newPassword2){
      let postData = {
        "email":this.curEmail,
        "password":this.oldPassword,
        "newpassword":this.newPassword1
      }
      this.http.post(this.url+'/api/changepassword',postData).subscribe((result)=>{
        let res = result as Msg;
        if(!res.code){
          this.success("密码修改成功！")
        }else{
          this.error("密码修改失败！")
        }
      },(error)=>{
        this.error("密码修改失败！")
      })

    }else{
      this.error("新密码两次输入不一致！")
    }
  }
  sendPhone() {
    this.http.post(this.url + '/api/sendsmscode', { "phone": this.telephone }).subscribe(result => {
      let info = result as Msg;
      if (info.code === 0) {
        this.sendPhoneOk = true;
      } else { this.sendPhoneErr = true }
    }, error => {
      this.sendPhoneErr = true;
    })
  }
  boundPhone() {
    console.log(111);
    this.http.post(this.url + '/api/validatesmscode', { "code": this.verification }).subscribe(result => {
      let info = result as Msg;
      if (info.code === 0) {
        this.success("手机号码绑定成功")
      } else {
        this.error("手机号码绑定失败")
      }
    }, error => {
      this.error("手机号码绑定失败");
    })
  }
  // checkOldPass(){
  //   this.oldPassErr = false;
  //   this.oldPassOk = false;
  //   console.log(this.oldPassword+'/'+this.curPassword)
  //   if(this.oldPassword!==this.curPassword){
  //     this.oldPassErr = true;
  //   }else{
  //     this.oldPassOk = true;
  //   }
  // }
  // private params() {
  //   let currentUser = JSON.parse(this.storage.retrieve('CurrentUser'));
  //   if (currentUser && currentUser.id) {
  //     let params = new HttpParams().set("userid",currentUser.id);
  //     let params = new HttpParams().set("userid",currentUser.id);
  //     return params;
  //   }
  // }
  validName() {
    if (this.userName === '') {
      this.isNameValid = true;
    } else {
      this.isNameValid = false;
    }
  }
  validEmail() {
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");
    if (this.curEmail === '') {
      this.isEmailValid = true;
    } else if (!reg.test(this.email)) {
      this.isEmailValid = true;
    } else {
      this.isEmailValid = false;
    }
  }
  validPhone() {
    var reg = new RegExp("^[1][3,4,5,7,8][0-9]{9}$");
    if (this.telephone === '') {
      this.isPhoneValid = true;
    } else if (!reg.test(this.telephone)) {
      this.isPhoneValid = true;
    } else {
      this.isPhoneValid = false;
    }
  }
  validPass(){
    console.log(this.newPassword1+ '/'+this.newPassword2)
    if (this.newPassword1 && this.newPassword2) {
      this.isPassValid = false;
    } else {
      this.isPassValid = true;
    }
  }
  success(msg): void {
    this.modalService.success({
      nzTitle: '账户提示：',
      nzContent: msg,
    });
  }
  error(msg): void {
    this.modalService.error({
      nzTitle: '账户提示：',
      nzContent: msg,
    });
  }
}
