import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ServiceService, MissionService } from '../../../service/service.service';
import { SelectItem } from 'primeng/primeng';
import { GoodsOper,GoodCate } from '../../../model/goods';
import { Securitybig } from '../../../model/securitybig';
import { Securitymiddle } from '../../../model/securitymiddle';
import { Securitysmall, SecruityType } from '../../../model/securitysmall';
import { Goodstype } from '../../../model/goodstype';
import { Storage } from '../../../model/storage';
import { Group } from "../../../model/group";
import { organization } from "../../../model/organization";
import { SelectGroupComponent } from '../../../dialog/select-group/select-group.component';
import { SelectOrgComponent } from '../../../dialog/select-org/select-org.component';
import { SelectMaterialTypeComponent } from '../../../dialog/select-material-type/select-material-type.component';
import { UploadFile } from "../../../model/upload";
import { Xiaooil, XiaooilOper } from "../../../model/xiaooil";
import { Others, OtherOper } from '../../../model/others';
import { Net, NetOper } from '../../../model/net';
import { Gun, GunOper } from '../../../model/gun';
import { Equip, EquipOper } from '../../../model/equip';
import { Saveoil, SaveoilOper } from '../../../model/saveoil';
import { Workboat, WorkboatOper } from '../../../model/workboat';
import { Pieoil, PieoilOper } from '../../../model/pieoil';
import { Dongli, DongliOper } from '../../../model/dongli';
import { Weiyou, WeiyouOper } from '../../../model/weiyou';
import { Car, CarOper } from '../../../model/car';
import { Ship, ShipOper } from '../../../model/ship';
import { Plane, PlaneOper } from '../../../model/plane';
@Component({
  selector: 'app-goodsoper',
  templateUrl: './goodsoper.component.html',
  styleUrls: ['./goodsoper.component.css'],
  providers: [MissionService]
})
export class GoodsoperComponent implements OnInit {
  catesEx: GoodCate[] = [];
  files: UploadFile[] = [];
  cates: Securitybig[] = [];
  cates1: Securitymiddle[] = [];
  cates2: Securitysmall[] = [];
  storages: Storage[] = [];
  goodsId: number = undefined;
  selStorage: boolean = false;
  goodstypes: Goodstype[] = [];
  vm: GoodsOper = new GoodsOper();
  selGroup: Group = null;
  selOrg: organization = null;
  defaultType: number = undefined;//编辑情况下已有的特征参数类型
  type: number = undefined;
  constructor(private serviceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MdDialog,
    private missionService: MissionService) {
  }
  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.goodsId = params['id'] as number;
      this.type = params['type'] as number;
      if (this.goodsId) {
        this.serviceService.Get('goods', '?id=eq.' + this.goodsId).subscribe(result => {
          this.vm = (result as GoodsOper[])[0];
          this.bigCates();
          this.selStorage = this.vm.storage ? true : false;
          this.defaultType = this.vm.type;
          if (this.vm.upload)
            this.files = JSON.parse(this.vm.upload) as UploadFile[];
          else
            this.files = [];
          if (this.vm.depart) {
            this.serviceService.Get('organization', '?id=eq.' + this.vm.depart).subscribe(result => {
              let os = result as organization[];
              if (os.length > 0) this.selOrg = os[0];
            });
          }
          if (this.vm.emerGroup) {
            this.serviceService.Get('group', '?id=eq.' + this.vm.emerGroup).subscribe(result => {
              let es = result as Group[];
              if (es.length > 0) this.selGroup = es[0];
            });
          }
        }, error => {
          console.log(error);
        });
      } else {
        this.vm.bigtype = 3;
        this.vm.middletype = 16;
        this.vm.smalltype = 60;
        this.vm.featureid = -1;
        this.bigCates();
      }

    });
    this.serviceService.Get('goodcate', '').subscribe(result => {
      this.catesEx = result as GoodCate[];
    });
    //获取goodstype
    this.serviceService.Get('goodstype', '?order=id.asc').subscribe(result => {
      this.goodstypes = result as Goodstype[];
    }, error => {
      console.log(error);
    });
    //获取存储库
    this.serviceService.Get('storage', '').subscribe(result => {
      this.storages = result as Storage[];
    }, error => { console.log(error); });
  }

  bigCates() {
    this.serviceService.Get('securitybig', '?order=id.asc').subscribe(result => {
      this.cates = result as Securitybig[];
      this.cate1Change(true);
    }, error => {
      console.log(error);
    });
  }



  cate1Change(bFirst: boolean) {//获取中类
    let par = '?order=id.asc&bigId=eq.' + this.vm.bigtype;
    this.cates1 = [];
    this.serviceService.Get('securitymiddle', par).subscribe(result => {
      this.cates1 = result as Securitymiddle[];
      if (!bFirst) {
        this.vm.middletype = this.cates1[0].id;
      }
      this.cate2Change(bFirst);
    }, error => {
      console.log(error);
    });
  }
  cate2Change(bFirst: boolean) {//获取小类
    let par = '?order=id.asc&middleId=eq.' + this.vm.middletype;
    this.cates2 = [];
    this.serviceService.Get('securitysmall', par).subscribe(result => {
      this.cates2 = result as Securitysmall[];
      if (!bFirst) {
        this.vm.smalltype = this.cates2[0].id;
      }
    }, error => {
      console.log(error);
    });
  }
  searchMType() {
    if (!this.vm.name) {
      alert('输入物资名称');
      return;
    }
    let dialogRef = this.dialog.open(SelectMaterialTypeComponent, {
      data: this.vm.name,
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let dt = result as SecruityType;
        if (dt) {
          this.vm.bigtype = dt.bigId;
          let par = '?order=id.asc&bigId=eq.' + this.vm.bigtype;
          this.cates1 = [];
          this.serviceService.Get('securitymiddle', par).subscribe(result => {
            this.cates1 = result as Securitymiddle[];
            this.vm.middletype = dt.midId;
            let par = '?order=id.asc&middleId=eq.' + this.vm.middletype;
            this.cates2 = [];
            this.serviceService.Get('securitysmall', par).subscribe(result => {
              this.cates2 = result as Securitysmall[];
              this.vm.smalltype = dt.smallId;
            }, error => {
              console.log(error);
            });
          }, error => {
            console.log(error);
          });
        }
      }
    });
  }
  searchGroup() {
    let dialogRef = this.dialog.open(SelectGroupComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != "-1") {
        this.selGroup = result as Group;
        this.vm.emerGroup = this.selGroup.id;
      }
    });
  }
  searchOrg() {
    let dialogRef = this.dialog.open(SelectOrgComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result != "-1" && result.data) {
        this.selOrg = result.data as organization;
        this.vm.depart = this.selOrg.id;
      }
    });
  }
  onSubmit() {
    if (this.goodsId) {//edit
      if (this.vm.type == 1) {//直升机
        let plane = this.missionService.source as PlaneOper;
        plane.typename = 1;
        if (this.defaultType == this.vm.type) {
          this.serviceService.Patch('plane', '?id=eq.' + this.vm.featureid, plane).subscribe(result => {
            this.edit(this.vm.featureid);
          }, error => {
            console.log(error);
          });
        } else {
          this.serviceService.Post('plane', plane).subscribe(f => {
            let fid = (f as Plane[])[0].id;
            this.add(fid);
          }, error => {
            console.log(error);
          });
        }

      } else if (this.vm.type == 2) {//船舶
        let ship = this.missionService.source as ShipOper;
        ship.typename = 2;
        if (this.defaultType == this.vm.type) {
          this.serviceService.Patch('ship', '?id=eq.' + this.vm.featureid, ship).subscribe(result => {
            this.edit(this.vm.featureid);
          }, error => {
            console.log(error);
          });
        } else {
          this.serviceService.Post('ship', ship).subscribe(f => {
            let fid = (f as Ship[])[0].id;
            this.add(fid);
          }, error => {
            console.log(error);
          });
        }

      } else if (this.vm.type == 3) {//车辆
        let car = this.missionService.source as CarOper;
        car.typename = 3;
        if (this.defaultType == this.vm.type) {
          this.serviceService.Patch('car', '?id=eq.' + this.vm.featureid, car).subscribe(result => {
            this.edit(this.vm.featureid);
          }, error => {
            console.log(error);
          });
        } else {
          this.serviceService.Post('car', car).subscribe(f => {
            let fid = (f as Car[])[0].id;
            this.add(fid);
          }, error => {
            console.log(error);
          });
        }

      } else if (this.vm.type == 4) {//围油栏
        let weiyou = this.missionService.source as WeiyouOper;
        weiyou.typename = 4;
        if (this.defaultType == this.vm.type) {
          this.serviceService.Patch('weiyou', '?id=eq.' + this.vm.featureid, weiyou).subscribe(result => {
            this.edit(this.vm.featureid);
          }, error => {
            console.log(error);
          });
        } else {
          this.serviceService.Post('weiyou', weiyou).subscribe(f => {
            let fid = (f as Weiyou[])[0].id;
            this.add(fid);
          }, error => {
            console.log(error);
          });
        }

      } else if (this.vm.type == 5) {//动力装置
        let dongli = this.missionService.source as DongliOper;
        dongli.typename = 5;
        if (this.defaultType == this.vm.type) {
          this.serviceService.Patch('dongli', '?id=eq.' + this.vm.featureid, dongli).subscribe(result => {
            this.edit(this.vm.featureid);
          }, error => {
            console.log(error);
          });
        } else {
          this.serviceService.Post('dongli', dongli).subscribe(f => {
            let fid = (f as Dongli[])[0].id;
            this.add(fid);
          }, error => {
            console.log(error);
          });
        }

      } else if (this.vm.type == 6) {//撇油器
        let pieoil = this.missionService.source as PieoilOper;
        pieoil.typename = 6;
        if (this.defaultType == this.vm.type) {
          this.serviceService.Patch('pieoil', '?id=eq.' + this.vm.featureid, pieoil).subscribe(result => {
            this.edit(this.vm.featureid);
          }, error => {
            console.log(error);
          });
        } else {
          this.serviceService.Post('pieoil', pieoil).subscribe(f => {
            let fid = (f as Pieoil[])[0].id;
            this.add(fid);
          }, error => {
            console.log(error);
          });
        }

      } else if (this.vm.type == 7) {//工作艇
        let workboat = this.missionService.source as WorkboatOper;
        workboat.typename = 7;
        if (this.defaultType == this.vm.type) {
          this.serviceService.Patch('workboat', '?id=eq.' + this.vm.featureid, workboat).subscribe(result => {
            this.edit(this.vm.featureid);
          }, error => {
            console.log(error);
          });
        } else {
          this.serviceService.Post('workboat', workboat).subscribe(f => {
            let fid = (f as Workboat[])[0].id;
            this.add(fid);
          }, error => {
            console.log(error);
          });
        }

      } else if (this.vm.type == 8) {//存储油器具
        let saveoil = this.missionService.source as SaveoilOper;
        saveoil.typename = 8;
        if (this.defaultType == this.vm.type) {
          this.serviceService.Patch('saveoil', '?id=eq.' + this.vm.featureid, saveoil).subscribe(result => {
            this.edit(this.vm.featureid);
          }, error => {
            console.log(error);
          });
        } else {
          this.serviceService.Post('saveoil', saveoil).subscribe(f => {
            let fid = (f as Saveoil[])[0].id;
            this.add(fid);
          }, error => {
            console.log(error);
          });
        }

      } else if (this.vm.type == 9) {//喷洒设备
        let equip = this.missionService.source as EquipOper;
        equip.typename = 9;
        if (this.defaultType == this.vm.type) {
          this.serviceService.Patch('equip', '?id=eq.' + this.vm.featureid, equip).subscribe(result => {
            this.edit(this.vm.featureid);
          }, error => {
            console.log(error);
          });
        } else {
          this.serviceService.Post('equip', equip).subscribe(f => {
            let fid = (f as Equip[])[0].id;
            this.add(fid);
          }, error => {
            console.log(error);
          });
        }
      } else if (this.vm.type == 10) {//手持喷枪
        let gun = this.missionService.source as GunOper;
        gun.typename = 10;
        if (this.defaultType == this.vm.type) {
          this.serviceService.Patch('gun', '?id=eq.' + this.vm.featureid, gun).subscribe(result => {
            this.edit(this.vm.featureid);
          }, error => {
            console.log(error);
          });
        } else {
          this.serviceService.Post('gun', gun).subscribe(f => {
            let fid = (f as Gun[])[0].id;
            this.add(fid);
          }, error => {
            console.log(error);
          });
        }
      } else if (this.vm.type == 11) {//油拖网
        let net = this.missionService.source as NetOper;
        net.typename = 11;
        if (this.defaultType == this.vm.type) {//未改
          this.serviceService.Patch('net', '?id=eq.' + this.vm.featureid, net).subscribe(result => {
            this.edit(this.vm.featureid);
          }, error => {
            console.log(error);
          });
        } else {
          this.serviceService.Post('net', net).subscribe(f => {
            let fid = (f as Net[])[0].id;
            this.edit(fid);
          }, error => {
            console.log(error);
          });
        }
      } else if (this.vm.type == 12) {//消油剂
        let xiaooil = this.missionService.source as XiaooilOper;
        xiaooil.typeid = 12;
        if (this.defaultType == this.vm.type) {//特征信息类型未改
          this.serviceService.Patch('xiaooil', '?id=eq.' + this.vm.featureid, xiaooil).subscribe(result => {
            this.edit(this.vm.featureid);
          }, error => { console.log(error); })
        } else {
          this.serviceService.Post('xiaooil', xiaooil).subscribe(f => {
            let fid = (f as Xiaooil[])[0].id;
            this.edit(fid);
          }, error => { console.log(error); });
        }
      } else if (this.vm.type == 13) { //其他
        let others = this.missionService.source as OtherOper;
        others.typeId = 13;
        if (this.defaultType == this.vm.type) { //未更改
          this.serviceService.Patch('others', '?id=eq.' + this.vm.featureid, others).subscribe(result => {
            this.edit(this.vm.featureid);
          }, error => {
            console.log(error);
          });
        } else {
          this.serviceService.Post('others', others).subscribe(f => {
            let fid = (f as Others[])[0].id;
            this.edit(fid);
          }, error => {
            console.log(error);
          });
        }
      }
    } else {//add
      if (this.vm.type == 1) {//直升机
        let plane = this.missionService.source as PlaneOper;
        plane.typename = 1;
        this.serviceService.Post('plane', plane).subscribe(f => {
          let fid = (f as Plane[])[0].id;
          this.add(fid);
        }, error => {
          console.log(error);
        });

      } else if (this.vm.type == 2) {//船舶
        let ship = this.missionService.source as ShipOper;
        ship.typename = 2;
        this.serviceService.Post('ship', ship).subscribe(f => {
          let fid = (f as Ship[])[0].id;
          this.add(fid);
        }, error => {
          console.log(error);
        });

      } else if (this.vm.type == 3) {//车辆
        let car = this.missionService.source as CarOper;
        car.typename = 3;
        this.serviceService.Post('car', car).subscribe(f => {
          let fid = (f as Car[])[0].id;
          this.add(fid);
        }, error => {
          console.log(error);
        });

      } else if (this.vm.type == 4) {//围油栏
        let weiyou = this.missionService.source as WeiyouOper;
        weiyou.typename = 4;
        this.serviceService.Post('weiyou', weiyou).subscribe(f => {
          let fid = (f as Weiyou[])[0].id;
          this.add(fid);
        }, error => {
          console.log(error);
        });

      } else if (this.vm.type == 5) {//动力装置
        let dongli = this.missionService.source as DongliOper;
        dongli.typename = 5;
        this.serviceService.Post('dongli', dongli).subscribe(f => {
          let fid = (f as Dongli[])[0].id;
          this.add(fid);
        }, error => {
          console.log(error);
        });

      } else if (this.vm.type == 6) {//撇油器
        let pieoil = this.missionService.source as PieoilOper;
        pieoil.typename = 6;
        this.serviceService.Post('pieoil', pieoil).subscribe(f => {
          let fid = (f as Pieoil[])[0].id;
          this.add(fid);
        }, error => {
          console.log(error);
        });

      } else if (this.vm.type == 7) {//工作艇
        let workboat = this.missionService.source as WorkboatOper;
        workboat.typename = 7;
        this.serviceService.Post('workboat', workboat).subscribe(f => {
          let fid = (f as Workboat[])[0].id;
          this.add(fid);
        }, error => {
          console.log(error);
        });

      } else if (this.vm.type == 8) {//存储油器具
        let saveoil = this.missionService.source as SaveoilOper;
        saveoil.typename = 8;
        this.serviceService.Post('saveoil', saveoil).subscribe(f => {
          let fid = (f as Saveoil[])[0].id;
          this.add(fid);
        }, error => {
          console.log(error);
        });

      } else if (this.vm.type == 9) {//喷洒设备
        let equip = this.missionService.source as EquipOper;
        equip.typename = 9;
        this.serviceService.Post('equip', equip).subscribe(f => {
          let fid = (f as Equip[])[0].id;
          this.add(fid);
        }, error => {
          console.log(error);
        });

      } else if (this.vm.type == 10) {//手持喷枪
        let gun = this.missionService.source as GunOper;
        gun.typename = 10;
        this.serviceService.Post('gun', gun).subscribe(f => {
          let fid = (f as Gun[])[0].id;
          this.add(fid);
        }, error => {
          console.log(error);
        });

      } else if (this.vm.type == 11) {//油拖网
        let net = this.missionService.source as NetOper;
        net.typename = 11;
        this.serviceService.Post('net', net).subscribe(f => {
          let fid = (f as Net[])[0].id;
          this.add(fid);
        }, error => {
          console.log(error);
        });

      } else if (this.vm.type == 12) {//消油剂
        let xiaooil = this.missionService.source as XiaooilOper;
        xiaooil.typeid = 12;
        this.serviceService.Post('xiaooil', xiaooil).subscribe(f => {
          let fid = (f as Xiaooil[])[0].id;
          this.add(fid);
        }, error => { console.log(error); });
      } else if (this.vm.type == 13) { //其他
        let others = this.missionService.source as OtherOper;
        others.typeId = 13;
        this.serviceService.Post('others', others).subscribe(f => {
          let fid = (f as Others[])[0].id;
          this.add(fid);
        }, error => {
          console.log(error);
        });
      }
    }
  }
  add(id) {
    this.vm.featureid = id;
    this.serviceService.Post('goods', this.vm).subscribe(result => {
      this.router.navigate(['resource/material'])
    }, error => {
      console.log(error);
    });
  }
  edit(id) {
    this.vm.featureid = id;
    this.serviceService.Patch('goods', '?id=eq.' + this.goodsId, this.vm).subscribe(result => {
      this.router.navigate(['resource/material'])
    }, error => {
      console.log(error);
    });
  }
  onBasicUpload(event) {
    if (event.xhr.status == 200) {
      let res = event.xhr.response;
      this.files = this.files.concat(JSON.parse(res));
    }
  }
  deleteUpFile(f) {
    let ary = [];
    this.files.forEach(element => {
      if (element.ExName != f) ary.push(element);
    });
    this.files = ary;
  }
}
