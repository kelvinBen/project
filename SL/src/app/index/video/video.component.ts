import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// declare var flvjs: any;
@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {
  selDate: Date = new Date();
  @ViewChild('videoEle') videoEle: ElementRef;
  constructor() { }

  ngOnInit() {

  }

}
