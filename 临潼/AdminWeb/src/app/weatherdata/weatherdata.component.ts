import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-weatherdata',
  templateUrl: './weatherdata.component.html',
  styleUrls: ['./weatherdata.component.css']
})
export class WeatherdataComponent implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
  }
  logout() {
    this.router.navigateByUrl('/weatherlogin');
  }

}
