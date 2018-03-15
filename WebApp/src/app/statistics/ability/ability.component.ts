import { Component, OnInit } from '@angular/core';
import { Exercise } from '../../model/exercise';
import { organization } from '../../model/organization';
import { Disaster } from '../../model/disaster';
import { DisasterSmallType } from '../../model/disasterSmallType';
import { ServiceService } from '../../service/service.service';
import * as moment from 'moment';
@Component({
  selector: 'app-ability',
  templateUrl: './ability.component.html',
  styleUrls: ['./ability.component.css']
})
export class AbilityComponent implements OnInit {
  data: any;
  display: boolean = false;
  orgs: organization[] = [];
  actionEnd: string = moment(new Date()).format('YYYY-MM-DD');
  actionStart: string = moment(new Date()).format('YYYY') + "-01-01";
  disEnd: string = moment(new Date()).format('YYYY-MM-DD');
  disStart: string = moment(new Date()).format('YYYY') + "-01-01";
  disTypes: DisasterSmallType[] = [];
  constructor(private serviceService: ServiceService) {
    this.serviceService.Get('disasterSmallType', '').subscribe(result => {
      this.disTypes = result as DisasterSmallType[];
      this.querydisaster();
    }, error => {
      console.log(error);
    });
    this.queryAction();
    this.data = {
      labels: ['辽东作业公司', '渤南作业公司', '渤西作业公司', '秦皇岛32-6/渤中作业公司'],
      datasets: [
        {
          data: [300, 50, 100, 82],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#FF00FF"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#FF00FF"
          ]
        }]
    };
  }

  actions: Exercise[] = [];
  actionChartData: object = {};
  queryAction() {
    let st = moment(this.actionStart).format('YYYY-MM-DD');
    let et = moment(this.actionEnd).format('YYYY-MM-DD');
    this.serviceService.Get('exercise', '?extime=gte.' + st + '&extime=lte.' + et).subscribe(result => {
      this.actions = result as Exercise[];
      let labels: { [key: string]: number } = {};
      for (let i = 0; i < this.actions.length; ++i) {
        let name = this.actions[i].depart;
        if (labels[name]) labels[name]++;
        else labels[name] = 1;
      }
      let ls: string[] = [];
      let ds: number[] = [];
      for (let k in labels) {
        ls.push(k);
        ds.push(labels[k]);
      }
      this.actionChartData = {
        labels: ls,
        datasets: [{
          data: ds,
          backgroundColor: ['#0D47A1', '#1976D2', '#039BE5', '#29B6F6', '#81D4FA', '#B2EBF2', '#BF360C', '#EF6C00', '#FB8C00', '#FFB300', '#FFCA28', '#FFF176']
        }]
      };
    });
  }

  disasters: Disaster[] = [];
  disChartData: object = {};
  querydisaster() {
    let st = moment(this.disStart).format('YYYY-MM-DD');
    let et = moment(this.disEnd).format('YYYY-MM-DD');
    this.serviceService.Get('disaster', '?time=gte.' + st + '&time=lte.' + et).subscribe(result => {
      this.disasters = result as Disaster[];
      let labels: { [key: string]: number } = {};
      for (let i = 0; i < this.disasters.length; ++i) {
        let typeID = this.disasters[i].smallType;
        let name = this.disTypes.find(function(v){return v.id == typeID});
        if (!name) continue;
        if (labels[name.name]) labels[name.name]++;
        else labels[name.name] = 1;
      }
      let ls: string[] = [];
      let ds: number[] = [];
      for (let k in labels) {
        ls.push(k);
        ds.push(labels[k]);
      }
      this.disChartData = {
        labels: ls,
        datasets: [{
          data: ds,
          backgroundColor: ['#0D47A1', '#1976D2', '#039BE5', '#29B6F6', '#81D4FA', '#B2EBF2', '#BF360C', '#EF6C00', '#FB8C00', '#FFB300', '#FFCA28', '#FFF176']
        }]
      };
    }, error => {
      console.log(error);
    });
  }

  ngOnInit() {
  }
  rows = [
    { name: '***', depart: '***', date: '2017-3-5', address: '***', need: '***', join: '***', content: '***' },
    { name: '***', depart: '***', date: '2017-3-5', address: '***', need: '***', join: '***', content: '***' },
    { name: '***', depart: '***', date: '2017-3-5', address: '***', need: '***', join: '***', content: '***' },
    { name: '***', depart: '***', date: '2017-3-5', address: '***', need: '***', join: '***', content: '***' },
    { name: '***', depart: '***', date: '2017-3-5', address: '***', need: '***', join: '***', content: '***' },
    { name: '***', depart: '***', date: '2017-3-5', address: '***', need: '***', join: '***', content: '***' }
  ];
  selectData(event) {
    this.display = true;
  }
}
