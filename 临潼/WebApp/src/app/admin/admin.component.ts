import { Component, OnInit, ViewChild, ElementRef, Renderer, HostListener } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: [
    './admin.component.css'
  ]
})
export class AdminComponent implements OnInit {
  @ViewChild('mainDiv') mainDiv: ElementRef;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.renderer.setElementStyle(this.mainDiv.nativeElement, 'height', (window.innerHeight - 64).toString() + 'px');
  }
  constructor(private renderer: Renderer) { }

  ngOnInit() {
    this.renderer.setElementStyle(this.mainDiv.nativeElement, 'height', (window.innerHeight - 64).toString() + 'px');
  }
}
