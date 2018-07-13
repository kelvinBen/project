import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import {Md5} from 'ts-md5/dist/md5';
import { NzModalService } from 'ng-zorro-antd';
import {CustomValidators} from 'ng2-validation';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
interface register {
  "error_code": number;
  "data": any;
}
@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.css']
})

export class RegComponent implements OnInit {
  validateForm: FormGroup;
  url = 'http://47.97.117.253:9000';
  submitForm(e): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    var postOptions = { headers: new HttpHeaders({ "Access-Control-Allow-Origin": "*" }) }
    var data = { "email": e.value.email, "password": e.value.password };
    this.http.post(this.url+'/register', data).subscribe(result => {
      let res = result as register;
      if (!res.error_code) {
        this.success();
        this.router.navigate(['/mcc/login']);
      } else {
        this.error();
      }
    }
    )
  }
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }
  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }
  getCaptcha(e: MouseEvent): void {
    e.preventDefault();
  }
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,private modalService: NzModalService) {
  }
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required,CustomValidators.email]],
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      remember: [true]
    });
  }
  success(): void {
    this.modalService.success({
      nzTitle: '注册提示：',
      nzContent: '注册成功！'
    });
  }

  error(): void {
    this.modalService.error({
      nzTitle: '注册提示：',
      nzContent: '注册失败！'
    });
  }
}
