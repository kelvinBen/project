import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {NewModel} from '../models/news'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
