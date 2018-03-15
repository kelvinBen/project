import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/primeng';
import { ShipEx } from "../../model/shipex";
import { Helicopter } from "../../model/helicopter";
import { ServiceService } from '../../service/service.service';
import { Securitybig } from '../../model/securitybig';
import { Securitymiddle } from '../../model/securitymiddle';
import { Securitysmall } from '../../model/securitysmall';
import { organization } from "../../model/organization";
import { Goods } from "../../model/goods";
import { Weiyou } from "../../model/weiyou";
import { Dongli } from "../../model/dongli";
import { Pieoil } from "../../model/pieoil";
import { Workboat } from "../../model/workboat";
import { Saveoil } from "../../model/saveoil";
import { Equip } from "../../model/equip";
import { Gun } from "../../model/gun";
import { Net } from "../../model/net";
import { Xiaooil } from "../../model/xiaooil";
import { Others } from "../../model/others";
@Component({
  selector: 'app-count',
  templateUrl: './count.component.html',
  styleUrls: ['./count.component.css']
})
export class CountComponent implements OnInit {
  selOrg: number = 74;
  ships: ShipEx[] = [];
  helicopters: Helicopter[] = [];
  constructor(private serviceService: ServiceService) { }

  ngOnInit() {
    this.orgChange();
    this.queryShips();
    this.queryHelicopters();
  }
  queryShips() {
    this.serviceService.Get('shipex', '?order=id.asc').subscribe(result => {
      this.ships = result as ShipEx[];
    }, error => {
      console.log(error);
    });
  }
  queryHelicopters() {
    this.serviceService.Get('helicopter', '?order=id.asc').subscribe(result => {
      this.helicopters = result as Helicopter[];
    }, error => {
      console.log(error);
    });
  }
  orgs: organization[] = []
  orgChange() {
    this.serviceService.Get('organization', '?parentid=eq.' + this.selOrg + '&order=sort.asc').subscribe(result => {
      this.orgs = result as organization[];
      this.orgs.forEach(ele => {
        this.queryWeiyou(ele.id);
        this.queryDongli(ele.id);
        this.queryPieiol(ele.id);
        this.queryWorkboat(ele.id);
        this.querySaveoil(ele.id);
        this.queryEquip(ele.id);
        this.queryGun(ele.id);
        this.queryNet(ele.id);
        this.queryXiaooil(ele.id);
        this.queryOthers(ele.id);
      });
    }, error => {
      this.orgs = [];
    });
  }
  downloadFile(url) {
    window.open(url);
  }
  weiyous: { [key: number]: Weiyou } = {};
  weiyouMap: { [key: number]: Goods } = {};
  queryWeiyou(orgID: number) {
    let par = '?type=eq.4&depart=eq.' + orgID;
    this.serviceService.Get('goods', par).subscribe(result => {
      let dts = result as Goods[];
      if (dts && dts.length > 0) {
        this.weiyouMap[orgID] = dts[0];
        this.serviceService.Get('weiyou', '?id=eq.' + dts[0].featureid).subscribe(result => {
          let dts = result as Weiyou[];
          if (dts && dts.length > 0) {
            this.weiyous[orgID] = (result as Weiyou[])[0];
          }
        }, error => {
          console.log(error);
        });
      }
    }, error => {
      console.log(error);
    });
  }
  donglis: { [key: number]: Dongli } = {};
  dongliMap: { [key: number]: Goods } = {};
  queryDongli(orgID: number) {
    let par = '?type=eq.5&depart=eq.' + orgID;
    this.serviceService.Get('goods', par).subscribe(result => {
      let dts = result as Goods[];
      if (dts && dts.length > 0) {
        this.dongliMap[orgID] = dts[0];
        this.serviceService.Get('dongli', '?id=eq.' + dts[0].featureid).subscribe(result => {
          let dts = result as Dongli[];
          if (dts && dts.length > 0) {
            this.donglis[orgID] = (result as Dongli[])[0];
          }
        }, error => {
          console.log(error);
        });
      }
    }, error => {
      console.log(error);
    });
  }
  pieiols: { [key: number]: Pieoil } = {};
  pieiolsMap: { [key: number]: Goods } = {};
  queryPieiol(orgID: number) {
    let par = '?type=eq.6&depart=eq.' + orgID;
    this.serviceService.Get('goods', par).subscribe(result => {
      let dts = result as Goods[];
      if (dts && dts.length > 0) {
        this.pieiolsMap[orgID] = dts[0];
        this.serviceService.Get('pieoil', '?id=eq.' + dts[0].featureid).subscribe(result => {
          let dts = result as Dongli[];
          if (dts && dts.length > 0) {
            this.pieiols[orgID] = (result as Pieoil[])[0];
          }
        }, error => {
          console.log(error);
        });
      }
    }, error => {
      console.log(error);
    });
  }
  workboat: { [key: number]: Workboat } = {};
  workboatMap: { [key: number]: Goods } = {};
  queryWorkboat(orgID: number) {
    let par = '?type=eq.7&depart=eq.' + orgID;
    this.serviceService.Get('goods', par).subscribe(result => {
      let dts = result as Goods[];
      if (dts && dts.length > 0) {
        this.workboatMap[orgID] = dts[0];
        this.serviceService.Get('workboat', '?id=eq.' + dts[0].featureid).subscribe(result => {
          let dts = result as Dongli[];
          if (dts && dts.length > 0) {
            this.workboat[orgID] = (result as Workboat[])[0];
          }
        }, error => {
          console.log(error);
        });
      }
    }, error => {
      console.log(error);
    });
  }
  saveoil: { [key: number]: Saveoil } = {};
  saveoilMap: { [key: number]: Goods } = {};
  querySaveoil(orgID: number) {
    let par = '?type=eq.8&depart=eq.' + orgID;
    this.serviceService.Get('goods', par).subscribe(result => {
      let dts = result as Goods[];
      if (dts && dts.length > 0) {
        this.saveoilMap[orgID] = dts[0];
        this.serviceService.Get('saveoil', '?id=eq.' + dts[0].featureid).subscribe(result => {
          let dts = result as Dongli[];
          if (dts && dts.length > 0) {
            this.saveoil[orgID] = (result as Saveoil[])[0];
          }
        }, error => {
          console.log(error);
        });
      }
    }, error => {
      console.log(error);
    });
  }
  equiq: { [key: number]: Equip } = {};
  equiqMap: { [key: number]: Goods } = {};
  queryEquip(orgID: number) {
    let par = '?type=eq.9&depart=eq.' + orgID;
    this.serviceService.Get('goods', par).subscribe(result => {
      let dts = result as Goods[];
      if (dts && dts.length > 0) {
        this.equiqMap[orgID] = dts[0];
        this.serviceService.Get('equiq', '?id=eq.' + dts[0].featureid).subscribe(result => {
          let dts = result as Dongli[];
          if (dts && dts.length > 0) {
            this.equiq[orgID] = (result as Equip[])[0];
          }
        }, error => {
          console.log(error);
        });
      }
    }, error => {
      console.log(error);
    });
  }
  guns: { [key: number]: Gun } = {};
  gunsMap: { [key: number]: Goods } = {};
  queryGun(orgID: number) {
    let par = '?type=eq.10&depart=eq.' + orgID;
    this.serviceService.Get('goods', par).subscribe(result => {
      let dts = result as Goods[];
      if (dts && dts.length > 0) {
        this.gunsMap[orgID] = dts[0];
        this.serviceService.Get('gun', '?id=eq.' + dts[0].featureid).subscribe(result => {
          let dts = result as Dongli[];
          if (dts && dts.length > 0) {
            this.guns[orgID] = (result as Gun[])[0];
          }
        }, error => {
          console.log(error);
        });
      }
    }, error => {
      console.log(error);
    });
  }
  nets: { [key: number]: Net } = {};
  netMap: { [key: number]: Goods } = {};
  queryNet(orgID: number) {
    let par = '?type=eq.11&depart=eq.' + orgID;
    this.serviceService.Get('goods', par).subscribe(result => {
      let dts = result as Goods[];
      if (dts && dts.length > 0) {
        this.netMap[orgID] = dts[0];
        this.serviceService.Get('net', '?id=eq.' + dts[0].featureid).subscribe(result => {
          let dts = result as Dongli[];
          if (dts && dts.length > 0) {
            this.nets[orgID] = (result as Net[])[0];
          }
        }, error => {
          console.log(error);
        });
      }
    }, error => {
      console.log(error);
    });
  }
  xiaooils: { [key: number]: Xiaooil } = {};
  xiaooilMap: { [key: number]: Goods } = {};
  queryXiaooil(orgID: number) {
    let par = '?type=eq.12&depart=eq.' + orgID;
    this.serviceService.Get('goods', par).subscribe(result => {
      let dts = result as Goods[];
      if (dts && dts.length > 0) {
        this.xiaooilMap[orgID] = dts[0];
        this.serviceService.Get('xiaooil', '?id=eq.' + dts[0].featureid).subscribe(result => {
          let dts = result as Dongli[];
          if (dts && dts.length > 0) {
            this.xiaooils[orgID] = (result as Xiaooil[])[0];
          }
        }, error => {
          console.log(error);
        });
      }
    }, error => {
      console.log(error);
    });
  }
  others: { [key: number]: Others } = {};
  otherMap: { [key: number]: Goods } = {};
  queryOthers(orgID: number) {
    let par = '?type=eq.13&depart=eq.' + orgID;
    this.serviceService.Get('goods', par).subscribe(result => {
      let dts = result as Goods[];
      if (dts && dts.length > 0) {
        this.otherMap[orgID] = dts[0];
        this.serviceService.Get('others', '?id=eq.' + dts[0].featureid).subscribe(result => {
          let dts = result as Dongli[];
          if (dts && dts.length > 0) {
            this.others[orgID] = (result as Others[])[0];
          }
        }, error => {
          console.log(error);
        });
      }
    }, error => {
      console.log(error);
    });
  }
}
