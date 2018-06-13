import { Component } from '@angular/core';

// import { AboutPage } from '../about/about';
import { ChartPage } from '../chart/chart';
import { HomePage } from '../home/home';
import { MapPage } from '../map/map';
import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ContactPage;
  tab3Root = ChartPage;
  tab4Root = MapPage;
  // tab5Root = AboutPage;

  constructor() {

  }
}
