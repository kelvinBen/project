import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavMenu } from '../model/navMenu';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  menus: NavMenu[] = [];
  navMenus: NavMenu[] = [];
  constructor(private _http: HttpClient) { }

  ngOnInit() {
    this._http.get('http://117.34.117.196:9017/nav_menu').subscribe(navMenus => {
      this.menus = navMenus as NavMenu[];
      const ms = this.menus.filter(m => {
        return !m.parent_id;
      }).sort((a, b) => {
        return a.sort.valueOf() - b.sort.valueOf();
      });
      ms.forEach(m => {
        m.child = this.getMenuChild(m.id);
      });
      this.navMenus = ms;
    });
  }

  getMenuChild(pId: Number): NavMenu[] {
    const ms = this.menus.filter(m => {
      return m.parent_id === pId;
    }).sort((a, b) => {
      return a.sort.valueOf() - b.sort.valueOf();
    });
    ms.forEach(m => {
      m.child = this.getMenuChild(m.id);
    });

    return ms;
  }

}
