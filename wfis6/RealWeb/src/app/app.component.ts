import { Component } from '@angular/core';

export class NavMenu {
  public Path: String;
  public Label: String;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class RealWebComponent {
  navLinks: NavMenu[] = [
    { Path: '/minute', Label: '分钟监测' },
    { Path: '/hour', Label: '小时监测' },
    { Path: '/radar', Label: '雷达' },
    { Path: '/chart', Label: '单站演变' },
    // { Path: '/grads', Label: '要素色斑图' }
  ];
}
