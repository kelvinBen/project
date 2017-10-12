import { Component, OnInit } from '@angular/core';
import { Lists } from '../model/list';
@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {
  isCollapsed = true;
  items: Lists[] = [
    new Lists(1, '分钟监测', 'minute'),
    new Lists(2, '小时监测', 'hour'),
    new Lists(3, '雷达', 'radar')
  ];
  constructor() { }

  ngOnInit() {
  }
}
