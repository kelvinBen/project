import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { equipOper } from '../../../model/equipment';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SelectMaterialTypeComponent } from '../../../dialog/select-material-type/select-material-type.component';
@Component({
  selector: 'app-equipment-oper',
  templateUrl: './equipment-oper.component.html',
  styleUrls: ['./equipment-oper.component.css']
})

export class EquipmentOperComponent implements OnInit {
  vm: equipOper = new equipOper();
  cates: Securitybig[] = [];
  cates1: Securitymiddle[] = [];
  cates2: Securitysmall[] = [];
  constructor(private http: HttpClient,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.vm.bigtype = 3;
    this.vm.middletype = 16;
    this.vm.smalltype = 60;
    this.bigCates();
  }

  bigCates() {
    this.http.get('http://117.34.117.196:8080/securitybig?order=id.asc').subscribe(result => {
      this.cates = result as Securitybig[];
      this.cate1Change(true);
    }, error => {
      console.log(error);
    });
  }
  cate1Change(bFirst: boolean) { // 获取中类
    const par = '?order=id.asc&bigId=eq.' + this.vm.bigtype;
    this.cates1 = [];
    this.http.get('http://117.34.117.196:8080/securitymiddle' + par).subscribe(result => {
      this.cates1 = result as Securitymiddle[];
      if (!bFirst) {
        this.vm.middletype = this.cates1[0].id;
      }
      this.cate2Change(bFirst);
    }, error => {
      console.log(error);
    });
  }
  cate2Change(bFirst: boolean) { // 获取小类
    const par = '?order=id.asc&middleId=eq.' + this.vm.middletype;
    this.cates2 = [];
    this.http.get('http://117.34.117.196:8080/securitysmall' + par).subscribe(result => {
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

    const dialogRef = this.dialog.open(SelectMaterialTypeComponent, {
      data: this.vm.name,
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const dt = result as SecruityType;
        if (dt) {
          this.vm.bigtype = dt.bigId;
          const par = '?order=id.asc&bigId=eq.' + this.vm.bigtype;
          this.cates1 = [];
          this.http.get('http://117.34.117.196:8080/securitymiddle' + par).subscribe(result1 => {
            this.cates1 = result1 as Securitymiddle[];
            this.vm.middletype = dt.midId;
            const par1 = '?order=id.asc&middleId=eq.' + this.vm.middletype;
            this.cates2 = [];
            this.http.get('http://117.34.117.196:8080/securitysmall' + par1).subscribe(result2 => {
              this.cates2 = result2 as Securitysmall[];
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
}
class SecruityType {
  public bigId: number;
  public big: string;
  public smallId: number;
  public small: string;
  public midId: number;
  public mid: string;
}

class Securitymiddle {
  constructor(
    public id: number,
    public bigId: number,
    public name: string
  ) { }
}

class Securitysmall {
  constructor(
    public id: number,
    public middleId: number,
    public name: string,
    public material: string
  ) { }
}

class Securitybig {
  constructor(
    public id: number,
    public name: string
  ) { }
}
