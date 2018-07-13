import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Msg } from '../../models/data';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NzModalService } from 'ng-zorro-antd';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  url = 'https://end.extraweather.com';
  email: string = '';
  key: string = '';
  validateForm: FormGroup;
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private activedRoute: ActivatedRoute, private modalService: NzModalService) { }
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
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      password: [null, [Validators.required]],
      checkPassword: [null, [Validators.required, this.confirmationValidator]],
      remember: [true]
    });
    this.activedRoute.params.forEach((params: Params) => {
      this.email = params['email'] as string;
      this.key = params['key'] as string;
    })
  }
  submitForm(e): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    var checkData = { "email": this.email, "key": this.key }
    var data = { "email": this.email, "password": e.value.password1 };
    this.http.post(this.url + '/checkgetback', checkData).subscribe(res => {
      let check = res as Msg;
      if (!check.code) {
        this.http.post(this.url + '/api/reset', data).subscribe(result => {
          let info = result as Msg;
          if (!info.code) {
            this.success()
          } else {
            this.error()
          }
        }, error => {
          this.error()
        }
        )
      } else {
        this.error()
      }
    }, error => {
      this.error()
    })

  }
  success(): void {
    this.modalService.success({
      nzTitle: '账户提示：',
      nzContent: "密码重置成功",
    });
  }
  error(): void {
    this.modalService.error({
      nzTitle: '账户提示：',
      nzContent: "密码重置失败",
    });
  }
}
