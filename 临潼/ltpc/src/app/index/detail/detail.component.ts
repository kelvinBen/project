import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { Detail } from './detail';
import { ServerService } from '../../service/server.service';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  srcUrl: any;
  detail: Detail = new Detail(null, null, null, null, null, null, null, null);
  errMsg: string;
  constructor(private ServerService: ServerService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer) {

  }

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      let id = params['id'];
      // console.log(id);
      this.ServerService.detailById(id)
        .subscribe(
        result => {
          if (result.code == 0) {
            let temp = result.data as Detail;
            temp.Context = this.HTMLDecode(temp.Context);
            console.log(temp);
            this.detail = temp;
          } else {
            console.log(result.msg);
          }
        },
        error => { this.errMsg = error; console.log(this.errMsg) }
        );

    });
  }

  HTMLDecode(text) {
    
    var temp = document.createElement("div");
    temp.innerHTML = text;
    var output = temp.innerText || temp.textContent;
    temp = null;
    if (output){
      return output;
    }
    return text;
  }

}
