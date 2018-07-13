import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Msg } from '../../models/data';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {
  url = 'https://end.extraweather.com';
  validateForm: FormGroup;
  constructor(private fb: FormBuilder,private http:HttpClient,private router:Router) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
    });
  }
  submit() {
    let email = this.validateForm.get('email').value;
    this.http.get(this.url+'/forgot?email='+email).subscribe(result=>{
      let info = result as Msg;
      if(!info.code){
        this.router.navigate(['/mcc/active'])
      }
      console.log(result);
    });
  }
}
