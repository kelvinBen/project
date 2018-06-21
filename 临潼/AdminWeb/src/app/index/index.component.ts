import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'ng2-webstorage';
import { User } from '../models/user';
import { Router } from "@angular/router";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  vm: User;
  constructor(private localSto: LocalStorageService,
  private router:Router) { }

  ngOnInit() {
    this.vm = this.localSto.retrieve('user') as User;
  }
  logout(){
    this.localSto.store('user', null);
    this.router.navigateByUrl('/login');
  }
}
