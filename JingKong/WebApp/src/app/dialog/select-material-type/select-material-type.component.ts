import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-select-material-type',
  templateUrl: './select-material-type.component.html',
  styleUrls: ['./select-material-type.component.css']
})
export class SelectMaterialTypeComponent implements OnInit {
  datas: SecruityType[] = [];
  displayedColumns = ['select', 'big', 'small', 'mid'];
  dataSource = null;
  selection = new SelectionModel<SecruityType>(true, []);
  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
    private _http: HttpClient,
    public dialogRef: MatDialogRef<SelectMaterialTypeComponent>) { }

  ngOnInit() {
    this._http.get('http://117.34.117.196:8080/securitysmall?material=like.*' + this.data + '*&order=id.asc').subscribe(result => {
      const dts = result as Securitysmall[];
      const ds = [];
      dts.forEach(function (v, i) {
        const d = new SecruityType();
        d.small = v.name;
        d.smallId = v.id;
        d.midId = v.middleId;
        ds.push(d);
      });
      this.datas = ds;
      console.log(ds);
      this._http.get('http://117.34.117.196:8080/securitymiddle').subscribe(result1 => {
        const ms = result1 as Securitymiddle[];
        this.datas.forEach(function (v) {
          const index = ms.find(function (n) { return n.id === v.midId });
          if (index) {
            v.mid = index.name;
            v.bigId = index.bigId;
          }
        });
        this._http.get('http://117.34.117.196:8080/securitybig').subscribe(result2 => {
          const bs = result2 as Securitybig[];
          this.datas.forEach(function (v) {
            const index = bs.find(function (n) { return n.id === v.bigId });
            if (index) {
              v.big = index.name;
            }
          });
          this.dataSource = new MatTableDataSource<SecruityType>(this.datas);
        }, error2 => { console.log(error2); });
      }, error1 => { console.log(error1); });
    }, error => { console.log(error); });
  }

  rowClick(row) {
    this.selection.clear();
    this.selection.toggle(row);
  }

  submit() {
    this.dialogRef.close(this.selection.selected[0]);
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
