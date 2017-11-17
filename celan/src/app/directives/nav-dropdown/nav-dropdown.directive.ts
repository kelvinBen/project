import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appNavDropdown]'
})
export class NavDropdownDirective {

  constructor(private el: ElementRef) { }

  toggle() {
    console.log(this.el.nativeElement.parentElement
      );
    this.el.nativeElement.classList.toggle('open');
    // this.el.nativeElement.parentElement.
    // this.el.nativeElement.nativeElement;
  }
}

/**
* Allows the dropdown to be toggled via click.
*/
@Directive({
  selector: '[appNavDropdownToggle]'
})
export class NavDropdownToggleDirective {
  constructor(private dropdown: NavDropdownDirective) {}

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    this.dropdown.toggle();
    console.log(this.dropdown);
  }
}

export const NAV_DROPDOWN_DIRECTIVES = [NavDropdownDirective, NavDropdownToggleDirective];
