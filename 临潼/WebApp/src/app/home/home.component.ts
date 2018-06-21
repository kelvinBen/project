import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', '../../assets/css/index.css']
})
export class HomeComponent implements OnInit {

    currentPic = 0;

    constructor() {
      setInterval(() => {
        let id = (this.currentPic + 1) % 3;
        this.currentPic = id;
      }, 3000)
    }

    changebanner(id) {
      this.currentPic = id;
    }

    ngOnInit() {

    }

}
