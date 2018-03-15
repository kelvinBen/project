import { Component, OnInit, ViewChild, ElementRef, Renderer, HostListener } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  @ViewChild('bodyWrapper') mianFrame: ElementRef;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.renderer.setElementStyle(this.mianFrame.nativeElement, 'height', (window.innerHeight - 64).toString() + 'px');
  }
  ngOnInit() {
    this.renderer.setElementStyle(this.mianFrame.nativeElement, 'height', (window.innerHeight - 64).toString() + 'px');
  }
  constructor(private renderer: Renderer, private router: Router) {

  }
  clickRouter(url) {
    this.router.navigateByUrl(url);
  }

}
