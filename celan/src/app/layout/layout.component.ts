import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MenuModel, SubMenu } from '../model/menu';

// Import navigation elements
import { navigation } from './../_nav';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public navigation = navigation;
 
  public isDropdown(item) {
    return item.children ? true : false;
  }
  public thisUrl(item) {
    return item.url;
  }
  public isActive(item) {
    return this._router.isActive(this.thisUrl(item), false);
  }
  constructor(private _http: HttpClient,
    private _router: Router) { }

  ngOnInit() {
  }
}


