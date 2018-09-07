import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Msg } from '../model/msg';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  data = []
  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getMenu(1).subscribe(result => {
      let info = result as Msg;
      if (info.errCode == 0) {
        this.data = info.data;
        console.log(this.data)
      } 
    })
  }

}
